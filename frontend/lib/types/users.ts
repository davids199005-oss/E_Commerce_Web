import type { UserListItem } from "@/lib/types/api"

export interface UserUpdate {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  country?: string
  city?: string
  username?: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface UsersListResponse {
  users: UserListItem[]
}
