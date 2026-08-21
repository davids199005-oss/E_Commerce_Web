import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/chat", label: "Помощник" },
  { href: "/orders", label: "Заказы" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Lumina
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Подвал">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lumina
        </p>
      </div>
    </footer>
  );
}
