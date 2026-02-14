import type { Metadata } from "next"
import "./globals.css"

import { Inter } from "next/font/google"
import { PrivyProvider } from "@/providers/PrivyProvider"

const nextFont = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "fallback",
})

export const metadata: Metadata = {
  title: "Naur",
  description: "your money Naur",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nextFont.className} antialiased`}>
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  )
}
