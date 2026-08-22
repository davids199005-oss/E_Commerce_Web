import type { Metadata } from "next"
import type { ReactElement } from "react"
import { Bricolage_Grotesque, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import StoreProvider from "./StoreProvider"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
})

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Ecom Shop",
  description:
    "Ecom Shop is a simple e-commerce store built with Next.js, Tailwind CSS, and TypeScript.",
}

export default function RootLayout({ children }: LayoutProps<"/">): ReactElement {
  return (
    <html
      lang="en"
      className={`h-full ${display.variable} ${body.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
