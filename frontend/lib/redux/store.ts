import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit"
import { api } from "@/lib/api/api"
import { authReducer, loggedOut } from "@/lib/features/auth/authSlice"

const sessionListener = createListenerMiddleware()

sessionListener.startListening({
  actionCreator: loggedOut,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(api.util.resetApiState())
  },
})

export function makeStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sessionListener.middleware).concat(api.middleware),
  })
}
