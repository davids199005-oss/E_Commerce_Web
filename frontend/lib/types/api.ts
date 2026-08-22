export interface MessageResponse {
  message: string
}

export interface Item {
  id: number
  name: string
  price_usd: string
  stock_qty: number
  image_url: string | null
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  country: string
  city: string
  created_at: string
  is_admin: boolean
}

export interface UserListItem {
  id: number
  username: string
  email: string
}

export type OrderStatus = "TEMP" | "CLOSED"

export interface Order {
  id: number
  status: OrderStatus
  shipping_country: string
  shipping_city: string
  total_price_usd: string
  created_at: string
  closed_at: string | null
}

export interface OrderItem {
  item_id: number
  name: string
  quantity: number
  unit_price: string
  stock_qty: number
  image_url: string | null
}

export interface OrderDetail extends Order {
  user_id: number
  items: OrderItem[]
}

export interface ChurnPrediction {
  user_id: number
  churn_probability: number
  will_churn: boolean
  features: Record<string, number>
}

export interface UserCreate {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  city: string
  username: string
  password: string
}

export interface ItemCreate {
  name: string
  price_usd: string | number
  stock_qty?: number
  image_url?: string | null
}
