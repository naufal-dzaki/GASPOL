import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GASPOL - GAS Planning Online",
  description:
    "Estimasi biaya bahan bakar perjalanan Anda di Indonesia dengan akurat. Gas sampai poll dengan perhitungan yang tepat.",
  keywords: ["fuel", "cost", "estimator", "Indonesia", "travel", "BBM", "Pertamina", "Shell", "BP", "GASPOL"],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF5F1F" },
    { media: "(prefers-color-scheme: dark)", color: "#FF5F1F" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.className}`}>
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
