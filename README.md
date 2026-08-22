# AI Shopping Website - ECOM School Final Project

A full end-to-end shopping platform with an AI assistant, built as the final project
for the ECOM School AI Developer course.

The system covers the complete customer journey - browsing a catalog, searching and
filtering products, saving favorites, building an order, purchasing it - plus an
AI assistant that answers questions about the store's inventory, an admin area for
catalog management, and a supervised machine-learning model that predicts customer
churn.

---

## Technology stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.13, FastAPI, MySQL 9.7 (raw parameterised SQL, no ORM), Redis 8.10 |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit + RTK Query, Tailwind CSS, shadcn/ui on Base UI |
| **AI assistant** | OpenAI API (Responses API) |
| **Machine learning** | scikit-learn, pandas, NumPy, joblib |
| **Infrastructure** | Docker Compose (MySQL + Redis) |
| **Tooling** | ruff (backend), ESLint + TypeScript strict (frontend) |

The backend follows the layered structure taught in the course:

```
controllers → services → repositories → database
```

Controllers know only about HTTP. Services hold business rules. Repositories are the
only place that contains SQL. Data contracts live in `models/`, shared enums in
`enums/`, and cross-cutting concerns (authentication, rate limiting, error mapping)
in `middleware/`.

---

## Project structure

```
E_Commerce_Web/
├── backend/
│   └── app/
│       ├── cache/           Redis client (catalog cache, chat counters)
│       ├── chat/            OpenAI client and assistant system prompt
│       ├── config/          typed settings loaded from .env
│       ├── controllers/     HTTP routers
│       ├── db/              connection pool, schema.sql, seed data
│       ├── enums/           order status, filter operators
│       ├── exceptions/      application error hierarchy
│       ├── middleware/      auth, rate limiting, exception handling
│       ├── models/          Pydantic schemas + TypedDict row records
│       ├── repositories/    SQL access
│       ├── services/        business logic
│       ├── static/pics/     product images served at /pics
│       └── utils/           password hashing, JWT
├── frontend/
│   ├── app/                 App Router pages, grouped by area
│   ├── components/          UI composed by domain
│   └── lib/                 API layer, Redux store, types, formatters
├── ml/
│   ├── generate_dataset.py  synthetic dataset generator
│   ├── train_churn_model.ipynb
│   ├── data/                training dataset
│   └── model/               serialised model
└── docker-compose.yml
```

---

## Getting started

### Prerequisites

- **Python 3.13** (3.12 minimum - the code uses the `type` statement introduced in 3.12)
- **Node.js 20+**
- **Docker Desktop**
- An **OpenAI API key** for the chat assistant

### 1. Start the databases

```bash
cp .env.example .env          # then fill in the values
docker compose up -d
```

This starts MySQL and Redis. On first run MySQL creates the schema from
`backend/app/db/schema.sql` and loads the product catalog.

### 2. Start the backend

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r backend/requirements.txt

cd backend
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`, interactive documentation at
`http://127.0.0.1:8000/docs`.

### 3. Start the frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The site is available at `http://localhost:3000`.

### 4. Grant yourself admin rights

Admin areas (catalog management, churn analytics) require the `is_admin` flag.
Register through the UI, then run in MySQL:

```sql
UPDATE users SET is_admin = TRUE WHERE username = 'your_username';
```

Log out and back in so the frontend picks up the new role.

---

## Environment variables

Both `.env` (backend, project root) and `frontend/.env.local` have committed
`.env.example` templates.

| Variable | Purpose |
|---|---|
| `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT` | database connection |
| `REDIS_HOST`, `REDIS_PORT` | cache connection |
| `ITEMS_CACHE_KEY`, `ITEMS_CACHE_TTL_SECONDS` | catalog cache key and lifetime |
| `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRATION_TIME` | token signing and lifetime in minutes |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | chat assistant |
| `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS` | request throttling |
| `MAX_PROMPTS_PER_DAY`, `CHAT_PROMPTS_KEY_PREFIX` | chat assistant quota |
| `NEXT_PUBLIC_API_BASE_URL` | frontend → backend address |

Settings are validated at startup by `pydantic-settings`: a missing or malformed
value stops the application immediately with a clear message instead of failing
later during a request.

---

## Application logic

### Authentication

Registration stores the password as a **bcrypt hash** - the plain value never
reaches the database. Login returns a **JWT** signed with `HS256`; the frontend
keeps it in `localStorage` and attaches it as a `Bearer` token to every request.

Because tokens are stateless, logging out is a client-side operation: the token is
discarded and the user sees the site as a guest.

Users can delete their own account. Everything associated with them - favorites,
orders, order lines - is removed by `ON DELETE CASCADE` constraints in the schema,
so the cleanup is guaranteed by the database rather than by application code.

### Catalog and search

`GET /items` returns the full catalog, or a filtered subset. Filters mirror the
requirements: several name fragments at once (`?names=sun&names=table`, matched with
`LIKE` and combined with `OR`), and range comparisons on price and stock through the
`lt` / `gt` / `eq` operators. When nothing matches, the API answers with an empty
list and an explanatory message rather than an error.

The query is assembled dynamically, but only its *structure* comes from code -
every user-supplied value travels as a bound parameter, so the endpoint is not
exposed to SQL injection.

The unfiltered catalog is cached in Redis and invalidated whenever stock or prices
change.

### Favorites

Each user keeps a personal list. The `(user_id, item_id)` composite primary key
guarantees at database level that an item cannot appear twice. The list is joined
against `items` on read, so favorites always show current prices and stock -
including `0` for items that have sold out.

### Orders

A user has at most one open order at a time. Adding the first item creates it
automatically with `TEMP` status; the constraint is enforced by a dedicated
`user_active_orders` table with a unique key on `user_id`, which removes the race
condition a code-level check would leave open.

Order lines store a **price snapshot** taken when the item was added, so historical
orders keep their original totals even if the catalog price changes later.

Removing the last line deletes the order entirely. Purchasing switches it to
`CLOSED`, after which it becomes read-only history.

### Stock management

Purchasing runs as a **single transaction**. Stock is decremented with a conditional
update:

```sql
UPDATE items SET stock_qty = stock_qty - %s WHERE id = %s AND stock_qty >= %s
```

Checking availability and reserving it happen in one atomic operation, so two
customers cannot both buy the last unit. If any line fails, the whole transaction is
rolled back and the customer is told which product ran out. Order lines are
processed in a deterministic order to avoid deadlocks between concurrent purchases.

### AI assistant

The assistant receives the current catalog as part of its system prompt, including
items that are out of stock, so it can distinguish "we do not sell that" from
"that is temporarily unavailable".

Each user gets **5 prompts per calendar day (UTC)**. The counter lives in Redis under
a key that contains the date, so it expires by itself. The quota is consumed
*before* the OpenAI call - an atomic `INCR` leaves no window for parallel requests to
slip past the limit - and refunded if the external service fails, so an outage does
not cost the user a prompt.

### Rate limiting

All API traffic passes through a Redis-backed limiter. Authenticated callers are
identified by user id extracted from their token, anonymous ones by IP address, so a
shared network address does not cause one visitor to block the others. Documentation
and static images are excluded.

### Error handling

Business failures are expressed as typed exceptions (`NotFoundError`,
`ConflictError`, `ValidationError`, `RateLimitError`, `ForbiddenError`,
`ServiceUnavailableError`). A single exception handler maps each type to its HTTP
status, which keeps controllers free of error-handling code and guarantees that the
same failure always produces the same status across the whole API.

---

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/auth/register` | public | create an account |
| `POST` | `/auth/login` | public | obtain a JWT |
| `GET` | `/items` | public | catalog, with optional filters |
| `GET` | `/items/{id}` | public | single product |
| `POST` | `/items` | admin | create a product |
| `PATCH` | `/items/{id}` | admin | update a product |
| `DELETE` | `/items/{id}` | admin | delete a product |
| `GET` | `/favorites` | user | favorites list |
| `POST` | `/favorites/{item_id}` | user | add to favorites |
| `DELETE` | `/favorites/{item_id}` | user | remove from favorites |
| `GET` | `/orders` | user | order history, open order first |
| `GET` | `/orders/{id}` | user | order details |
| `GET` | `/orders/active` | user | current open order |
| `POST` | `/orders/items` | user | add an item to the open order |
| `PATCH` | `/orders/items/{item_id}` | user | change quantity |
| `DELETE` | `/orders/items/{item_id}` | user | remove a line |
| `DELETE` | `/orders/active` | user | discard the open order |
| `POST` | `/orders/purchase` | user | complete the purchase |
| `POST` | `/chat/message` | user | ask the assistant |
| `GET` | `/chat/usage` | user | remaining prompts |
| `GET` | `/users/me` | user | profile |
| `PATCH` | `/users/me` | user | update profile |
| `PATCH` | `/users/me/password` | user | change password |
| `DELETE` | `/users/me` | user | delete account |
| `GET` | `/users` | admin | list users |
| `GET` | `/analytics/churn/{user_id}` | admin | churn prediction |

---

## Machine learning - churn prediction

The bonus task is a supervised binary classifier that estimates whether a customer
will stop ordering within the next 90 days.

**Features**, all computed from real database records so the same values can be
produced at prediction time: account age, number of completed orders, total spent,
average order value, days since the last order, and number of favorites.

**Dataset.** The store has no historical customer base, so `ml/generate_dataset.py`
produces 3 000 synthetic users. The label is deliberately **probabilistic** - a
logistic score plus noise - rather than a fixed rule, because a deterministic label
would let any model rediscover the rule with perfect accuracy and prove nothing.
Internal consistency is preserved: totals match order counts, and nobody can be
inactive for longer than their account has existed.

**Training** (`ml/train_churn_model.ipynb`) compares a logistic-regression baseline
against a tuned Random Forest:

| Model | CV ROC-AUC | Test ROC-AUC |
|---|---|---|
| Logistic regression | **0.8726** | **0.8822** |
| Random Forest (GridSearchCV) | 0.8650 | 0.8773 |

The ensemble brought no improvement, so the simpler and more interpretable model was
selected for production. Grid search settling on the shallowest forest in the grid
(`max_depth=4`) supports the same conclusion: the decision boundary is smooth, and
deeper trees only fit noise.

**Feature importance** is dominated by days since the last order (≈0.55), followed by
total spent and order count - consistent with classic RFM behaviour in retail.
Favorites count turned out to be almost useless (≈0.007), so wishlist activity is a
poor churn signal in this data.

The model is stored together with its feature order (`joblib`) and loaded once at
application startup. `GET /analytics/churn/{user_id}` builds the features from live
database records using exactly the same conventions as the generator and returns the
probability along with the values it was computed from.

**Limitation:** the dataset is synthetic, so these scores demonstrate a working
pipeline rather than a production benchmark.

---

## Known limitations

These are deliberate trade-offs, documented for transparency:

- **Stateless tokens are not revoked.** Changing a password or deleting an account
  does not invalidate tokens already issued; they expire naturally. Revocation would
  require a server-side denylist.
- **The rate limiter uses a fixed window,** which permits a short burst across a
  window boundary. A sliding window would be more precise at the cost of storing a
  timestamp per request.
- **Redis is accessed synchronously.** Endpoints run in FastAPI's thread pool, so
  this does not block the event loop; the middleware explicitly offloads its call for
  the same reason. A production deployment would use `redis.asyncio`.
- **Product images are served by the application.** In production a reverse proxy or
  CDN would serve them instead.
- **Account deletion is permanent** and removes order history. Real stores retain it
  for accounting; the cascade here follows the assignment's explicit requirement.
