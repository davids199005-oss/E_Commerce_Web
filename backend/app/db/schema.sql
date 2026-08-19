
# Schema for the database
CREATE TABLE users
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(50)  NOT NULL,
    country       VARCHAR(100) NOT NULL,
    city          VARCHAR(100) NOT NULL,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
);
CREATE TABLE items
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255)   NOT NULL,
    price_usd  DECIMAL(10, 2) NOT NULL,
    stock_qty  INT            NOT NULL DEFAULT 0,
    created_at TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    image_url  VARCHAR(500) NOT NULL,
    CHECK (price_usd >= 0),
    CHECK (stock_qty >= 0)
);
CREATE TABLE favorites
(
    user_id    INT NOT NULL,
    item_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (item_id) REFERENCES items (id)
);
CREATE TABLE orders
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT            NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at        TIMESTAMP DEFAULT NULL,
    shipping_country VARCHAR(100)   NOT NULL,
    shipping_city    VARCHAR(100)   NOT NULL,
    total_price_usd  DECIMAL(10, 2) NOT NULL,
    status           ENUM('TEMP', 'CLOSED') NOT NULL DEFAULT 'TEMP',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE TABLE order_items
(
    order_id INT            NOT NULL,
    item_id  INT            NOT NULL,
    quantity INT            NOT NULL,
    unit_usd DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);
CREATE TABLE user_active_orders
(
    user_id  INT NOT NULL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);