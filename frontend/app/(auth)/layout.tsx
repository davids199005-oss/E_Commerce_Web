import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Lumina
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
