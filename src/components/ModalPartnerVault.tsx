"use client"

import { atom, useAtom } from "jotai"
import { useRouter } from "next/navigation"

import { useVaultWallet } from "@/hooks/useVaultWallet"
import { useBalance } from "@/hooks/useBalance"

import { BaseModal } from "./BaseModal"

const atomIsOpenPartnerVault = atom(false)
export const useModalPartnerVault = () => useAtom(atomIsOpenPartnerVault)

export function ModalPartnerVault() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useModalPartnerVault()

  const { vaultWallet } = useVaultWallet()
  const { formattedBalance } = useBalance(vaultWallet)

  if (!isOpen) return null

  return (
    <BaseModal
      ariaLabel="Partner vault"
      title="💝 Partner Vault"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-white/60">Balance</p>
        <p className="mt-2 text-4xl font-black text-white">
          ${formattedBalance}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          onClick={() => {
            router.push("/wallet")
            setIsOpen(false)
          }}
          className="rounded-xl font-bold bg-wb-green px-3 py-3 text-sm text-black"
        >
          MANAGE
        </button>
      </div>
    </BaseModal>
  )
}
