"use client"

import type { PropsWithChildren } from "react"
import Link from "next/link"

import { Footer } from "@/components/Footer"
import { IoIosFlame } from "react-icons/io"

import { IconLogo } from "./icons"
import AddressBlock from "./AddressBlock"
import { useAuth } from "@/lib/wallet"

export function MainLayout({ children }: PropsWithChildren) {
  const { isConnected, username, login, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="flex border-b border-white/5 mb-5 items-center justify-between p-6">
        <Link className="w-24 text-white" href="/">
          <IconLogo />
        </Link>

        {isConnected ? (
          <section className="flex items-center gap-3">
            <div className="flex items-center gap-px rounded-full bg-wb-violet/20 px-3 h-8 text-white">
              <IoIosFlame className="text-xl text-white" />
              <span className="text-lg scale-95 font-black">7</span>
            </div>

            <button onClick={logout}>
              <figure className="size-8 rounded-lg overflow-hidden">
                <AddressBlock name={username} />
              </figure>
            </button>
          </section>
        ) : (
          <button onClick={login} className="flex items-center gap-3">
            <p className="text-white font-bold">Sign In</p>
            <figure className="size-8 rounded-lg overflow-hidden">
              <AddressBlock name="WeBound" />
            </figure>
          </button>
        )}
      </header>

      {/* Page Content */}
      <main className="px-6">{children}</main>

      <Footer />
    </div>
  )
}
