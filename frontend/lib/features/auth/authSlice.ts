import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction, Reducer } from "@reduxjs/toolkit"
import { authStorage } from "@/lib/features/auth/authStorage"
import type { User } from "@/lib/types/api"
import type { AuthRootState, AuthState } from "@/lib/types/auth"

const initialState: AuthState = {
  token: null,
  user: null,
  isHydrated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrated(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      state.isHydrated = true
    },
    tokenReceived(state, action: PayloadAction<string>) {
      state.token = action.payload
      authStorage.write(action.payload)
    },
    userReceived(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    loggedOut(state) {
      state.token = null
      state.user = null
      authStorage.clear()
    },
  },
})

export const { hydrated, tokenReceived, userReceived, loggedOut } = authSlice.actions

export const authReducer: Reducer<AuthState> = authSlice.reducer

export const selectToken = (state: AuthRootState): string | null => state.auth.token

export const selectUser = (state: AuthRootState): User | null => state.auth.user

export const selectIsAuthenticated = (state: AuthRootState): boolean => state.auth.token !== null

export const selectIsAdmin = (state: AuthRootState): boolean => state.auth.user?.is_admin === true

export const selectIsHydrated = (state: AuthRootState): boolean => state.auth.isHydrated
