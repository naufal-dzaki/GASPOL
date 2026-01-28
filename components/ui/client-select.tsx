"use client"

import dynamic from "next/dynamic"
import type { Props } from "react-select"

const ClientSelect = dynamic<Props<any, false>>(
  () => import("react-select"),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 rounded-md border border-input bg-muted animate-pulse" />
    ),
  }
)

export default ClientSelect
