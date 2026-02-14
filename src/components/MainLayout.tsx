import Link from "next/link"

import { FaFire } from "react-icons/fa"
import { Footer } from "@/components/Footer"
import { IconLogo } from "./icons"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="flex border-b border-white/5 mb-5 items-center justify-between p-6">
        <Link className="w-24 text-white" href="/">
          <IconLogo />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-wb-violet/20 px-3 py-1.5 text-white">
            <FaFire className="text-sm text-orange-300" />
            <span className="text-sm font-semibold">7</span>
          </div>

          <button className="relative w-10 h-10 bg-wb-violet/20 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-wb-violet rounded-full" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-wb-red rounded-full text-sm flex items-center justify-center text-white font-bold">
              1
            </span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="px-6">{children}</main>

      <Footer />
    </div>
  )
}
