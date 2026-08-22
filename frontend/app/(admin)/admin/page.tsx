"use client"

import { useEffect } from "react"
import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { LoadingRows } from "@/components/feedback/LoadingRows"

export default function AdminIndexPage(): ReactElement {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/items")
  }, [router])

  return <LoadingRows rows={3} />
}
