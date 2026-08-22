import type { ReactNode } from "react"
import type { IconSvgElement } from "@hugeicons/react"
import type { Item, UserListItem } from "@/lib/types/api"
import type { ChurnPrediction } from "@/lib/types/api"

export interface AdminPageProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export interface AdminNavItem {
  href: string
  label: string
  icon: IconSvgElement
}

export interface AdminLayoutProps {
  children: ReactNode
}

export interface ItemsTableProps {
  items: readonly Item[]
  onEdit: (item: Item) => void
  onDelete: (item: Item) => void
}

export interface DeleteItemDialogProps {
  item: Item | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface ItemFormDialogProps {
  item: Item | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface UserPickerProps {
  users: readonly UserListItem[]
  value: string | null
  onChange: (value: string | null) => void
}

export interface UserOption {
  label: string
  value: string
}

export interface ChurnReportProps {
  prediction: ChurnPrediction
  username: string
}
