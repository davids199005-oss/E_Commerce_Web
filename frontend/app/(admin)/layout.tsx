import type { ReactNode } from "react";

import { AdminGate } from "@/components/auth/AdminGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGate>
      <div className="flex min-h-full flex-1 flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </AdminGate>
  );
}
