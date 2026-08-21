import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";

import StoreProvider from "@/app/StoreProvider";
import { cn } from "@/lib/utils";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-cyrillic",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumina",
    template: "%s · Lumina",
  },
  description: "Светлый маркетплейс повседневных товаров",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={cn(
        "h-full antialiased",
        plusJakarta.variable,
        inter.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
