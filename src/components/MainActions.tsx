"use client"

import { useVaultWallet } from "@/hooks/useVaultWallet"
import { FaChevronRight, FaStarOfLife } from "react-icons/fa"
import { InvitePartner } from "./InvitePartner"
import { useModalPartnerVault } from "./ModalPartnerVault"

export default function MainActions() {
  const [, setIsVaultOpen] = useModalPartnerVault()
  const { vaultWallet } = useVaultWallet()

  return (
    <nav className="mb-6">
      {vaultWallet ? (
        <button
          onClick={() => setIsVaultOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-linear-to-br from-wb-green to-pink-300 border border-black/10 px-4 h-12 text-black"
        >
          <FaStarOfLife className="text-2xl scale-95" />
          <h2>Set a reward for your streak</h2>
          <FaChevronRight />
        </button>
      ) : (
        <InvitePartner />
      )}
    </nav>
  )
}
