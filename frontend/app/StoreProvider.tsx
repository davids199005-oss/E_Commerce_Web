"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import { Provider } from "react-redux"
import { AuthHydrator } from "@/components/auth/AuthHydrator"
import { Toaster } from "@/components/ui/sonner"
import { makeStore } from "@/lib/redux/store"
import type { StoreProviderProps } from "@/lib/types/components/layout"
import type { AppStore } from "@/lib/types/store"

export default function StoreProvider({ children }: StoreProviderProps): ReactElement {
  const [store] = useState<AppStore>(makeStore)

  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
      <Toaster theme="light" richColors={false} position="bottom-right" />
    </Provider>
  )
}
