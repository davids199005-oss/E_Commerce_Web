export type MoneyJson = string | number;

export interface Item {
  id: number;
  name: string;
  price_usd: MoneyJson;
  stock_qty: number;
  image_url: string | null;
}

export interface ItemsResponse {
  items: Item[];
  message?: string;
}

export interface ItemWritePayload {
  name: string;
  price_usd: number;
  stock_qty: number;
  image_url: string | null;
}

export interface ItemPatchPayload {
  name?: string;
  price_usd?: number;
  stock_qty?: number;
  image_url?: string | null;
}

export const FilterOperator = {
  Eq: "eq",
  Gt: "gt",
  Lt: "lt",
} as const;

export type FilterOperator =
  (typeof FilterOperator)[keyof typeof FilterOperator];

export interface ItemsQuery {
  names?: string;
  price_op?: FilterOperator;
  price_value?: number;
  stock_op?: FilterOperator;
  stock_value?: number;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  city: string;
  created_at: string;
  is_admin: boolean;
}

export interface UserListItem {
  id: number;
  username: string;
  email: string;
}

export interface UsersListResponse {
  users: UserListItem[];
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  username?: string;
}

export interface PasswordChangePayload {
  current_password: string;
  new_password: string;
}

export const OrderStatus = {
  Temp: "TEMP",
  Closed: "CLOSED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id: number;
  status: string;
  shipping_country: string;
  shipping_city: string;
  total_price_usd: MoneyJson;
  created_at: string;
  closed_at: string | null;
}

export interface OrdersResponse {
  orders: Order[];
  message?: string;
}

export interface OrderItem {
  item_id: number;
  name: string;
  quantity: number;
  unit_price: MoneyJson;
  stock_qty: number;
  image_url: string | null;
}

export interface OrderDetail extends Order {
  user_id: number;
  items: OrderItem[];
}

export interface AddOrderItemPayload {
  item_id: number;
  quantity: number;
}

export interface ChatAnswer {
  answer: string;
  prompts_used: number;
  prompts_remaining: number;
}

export interface ChatUsage {
  prompts_used: number;
  prompts_remaining: number;
}

export interface ChurnPrediction {
  user_id: number;
  churn_probability: number;
  will_churn: boolean;
  features: Record<string, number>;
}

export interface ItemCreatedResponse {
  message: string;
  item_id: number;
}
