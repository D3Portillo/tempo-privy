"use client"

import { atom, useAtom } from "jotai"
import { BaseModal } from "./BaseModal"

const atomIsOpenPartnerVault = atom(false)
export const useModalPartnerVault = () => useAtom(atomIsOpenPartnerVault)

export function ModalPartnerVault() {
  const [isOpen, setIsOpen] = useModalPartnerVault()

  if (!isOpen) return null

  return (
    <BaseModal
      ariaLabel="Partner vault"
      title="Partner Vault"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-white/60">Balance</p>
        <p className="mt-2 text-4xl font-black text-white">$10.42</p>
      </div>

      <div className="mt-8 grid gap-2">
        <button className="rounded-xl bg-wb-green px-3 py-3 text-sm font-semibold text-black">
          Deposit
        </button>

        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          Withdraw
        </button>
      </div>
    </BaseModal>
  )
}
