"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaGift, FaCalendarAlt, FaHeart } from "react-icons/fa"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/treats", label: "Treats", icon: FaGift },
  { href: "/timeline", label: "Memories", icon: FaCalendarAlt },
  { href: "/us", label: "Us", icon: FaHeart },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <nav className="fixed sm:rounded-t-4xl bottom-0 left-1/2 w-full max-w-2xl border-t-2 border-white/10 drop-shadow-lg -translate-x-1/2 bg-[#0b1a3d] px-6 pt-5 pb-4">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={`nav-item-${href}`}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-purple-200" : "text-white/50",
              )}
            >
              <Icon className="text-xl" />
              <span className="text-sm">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
