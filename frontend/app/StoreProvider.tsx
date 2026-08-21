"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { AuthHydrator } from "@/components/auth/AuthHydrator";
import { Toaster } from "@/components/ui/sonner";
import { makeStore } from "@/lib/redux/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <AuthHydrator>
        {children}
        <Toaster />
      </AuthHydrator>
    </Provider>
  );
}
