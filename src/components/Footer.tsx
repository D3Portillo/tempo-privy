"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaGift, FaCalendarAlt, FaHeart } from "react-icons/fa"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/treats", label: "Treats", icon: FaGift },
  { href: "/timeline", label: "Timeline", icon: FaCalendarAlt },
  { href: "/us", label: "Us", icon: FaHeart },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-indigo-950 px-6 py-3 pb-6">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 ${isActive ? "text-wb-violet" : "text-gray-400"}`}
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
