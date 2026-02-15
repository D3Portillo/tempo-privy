"use client"

import { useAuth } from "@/lib/wallet"
import { useModalPartnerSync } from "./ModalPartnerSync"

import { BsEnvelopeOpenHeartFill } from "react-icons/bs"
import { FaChevronRight } from "react-icons/fa"

export function InvitePartner() {
  const { login, isConnected } = useAuth()
  const [, setIsOpen] = useModalPartnerSync()

  return (
    <button
      onClick={() => {
        if (isConnected) return setIsOpen(true)
        // Show wallet flow when not connected
        login()
      }}
      className="flex w-full items-center justify-between rounded-2xl bg-linear-to-br from-pink-300/50 border border-white/10 to-wb-violet/50 px-4 h-12 text-white"
    >
      <BsEnvelopeOpenHeartFill className="text-2xl" />
      <h2>Let's invite your partner</h2>
      <FaChevronRight />
    </button>
  )
}
