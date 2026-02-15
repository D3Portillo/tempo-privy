"use client"

import Link from "next/link"
import { Fragment, useState, type PropsWithChildren } from "react"

import { useAuth } from "@/lib/wallet"
import { Footer } from "@/components/Footer"

import { IoIosFlame } from "react-icons/io"
import { FiLogOut } from "react-icons/fi"
import { BsFillArrowThroughHeartFill } from "react-icons/bs"
import { PiVaultFill } from "react-icons/pi"

import { useModalPartnerSync } from "./ModalPartnerSync"
import { ModalPartnerVault, useModalPartnerVault } from "./ModalPartnerVault"
import { SectionStreak } from "./SectionStreak"
import { IconLogo } from "./icons"

import { useVaultWallet } from "@/hooks/useVaultWallet"
import AddressBlock from "./AddressBlock"

export function MainLayout({ children }: PropsWithChildren) {
  const [, setIsOpen] = useModalPartnerSync()

  const { isConnected, username, login, logout, evmAddress } = useAuth()
  const [isStreakOpen, setIsStreakOpen] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useModalPartnerVault()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { vaultWallet } = useVaultWallet()

  const hasVault = Boolean(vaultWallet)

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-24">
      {/* Header */}
      <header className="flex border-b border-white/5 mb-5 items-center justify-between p-6">
        <Link className="w-24 text-white" href="/">
          <IconLogo />
        </Link>

        {isConnected ? (
          <section
            id="auth-dropdown"
            className="relative flex items-center gap-3"
          >
            <button
              onClick={() => setIsStreakOpen(true)}
              className="flex h-8 items-center gap-px rounded-full bg-wb-red/80 px-3 text-white"
            >
              <IoIosFlame className="text-xl text-white" />
              <span className="text-lg scale-95 font-black">7</span>
            </button>

            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="rounded-lg overflow-hidden ring-2 ring-transparent transition focus:ring-wb-violet/40"
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              <figure className="size-8">
                <AddressBlock name={username} />
              </figure>
            </button>

            {isDropdownOpen ? (
              <Fragment>
                <button
                  aria-label="Close menu"
                  onClick={() => setIsDropdownOpen(false)}
                  className="fixed inset-0 z-10"
                />

                <div className="absolute right-0 top-12 z-11 min-w-44 rounded-2xl border border-white/10 bg-slate-800/95 p-2 shadow-lg backdrop-blur">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsOpen(true)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <BsFillArrowThroughHeartFill className="text-base text-pink-300" />
                    <span>Invite Partner</span>
                  </button>

                  {hasVault ? (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        setIsVaultOpen(true)
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      <PiVaultFill className="text-wb-green text-base" />
                      <span>Partner Vault</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      logout()
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <FiLogOut className="text-base" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </Fragment>
            ) : null}
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
      <main className="px-6 pb-12">{children}</main>

      <Footer />
      <SectionStreak
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
      />
    </div>
  )
}
