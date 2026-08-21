import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { UserProfile } from "@/lib/types/api";

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrated: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isHydrated = true;
      if (!action.payload) {
        state.user = null;
      }
    },
    tokenReceived: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    userReceived: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    loggedOut: () => ({
      token: null,
      user: null,
      isHydrated: true,
    }),
  },
});

export const { hydrated, tokenReceived, userReceived, loggedOut } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
