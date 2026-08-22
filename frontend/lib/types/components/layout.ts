import type { ReactNode } from "react"
import type { IconSvgElement } from "@hugeicons/react"

export interface PageContainerProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export interface ShopLayoutProps {
  children: ReactNode
}

export interface StoreProviderProps {
  children: ReactNode
}

export interface NavItem {
  href: string
  label: string
  icon: IconSvgElement
  requiresAuth: boolean
}

export type HeaderDensity = "bar" | "sheet"

export interface SignedOutActionsProps {
  density: HeaderDensity
}
