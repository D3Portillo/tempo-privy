"use client"

import { useState } from "react"
import { toast } from "sonner"

import { MainLayout } from "@/components/MainLayout"
import { BaseModal } from "@/components/BaseModal"

import { useModalPartnerVault } from "@/components/ModalPartnerVault"
import { useBalance } from "@/hooks/useBalance"
import { useVaultWallet } from "@/hooks/useVaultWallet"
import { useAuth } from "@/lib/wallet"

export default function WalletPage() {
  const { evmAddress } = useAuth()
  const { vaultWallet, isWalletReady } = useVaultWallet()
  const [, setIsVaultOpen] = useModalPartnerVault()

  const { balance: walletBalance } = useBalance(evmAddress)
  const { balance: vaultBalance } = useBalance(vaultWallet)

  const [sendEmail, setSendEmail] = useState("")
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)

  const handleSend = () => {
    if (!sendEmail.trim()) {
      toast.error("Add an email first")
      return
    }

    toast.success(`Send flow started for ${sendEmail.trim()}`)
    setSendEmail("")
    setIsSendModalOpen(false)
  }

  return (
    <MainLayout>
      <div className="mt-12 space-y-7">
        <section className="rounded-3xl border border-white/10 bg-linear-to-br from-wb-violet/30 to-pink-300/20 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">
                YOUR WALLET
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                ${walletBalance}
              </p>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-white/15 text-2xl">
              💸
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => toast.info("Top-up flow coming next")}
              className="rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900"
            >
              Top-up
            </button>

            <button
              type="button"
              onClick={() => setIsSendModalOpen(true)}
              className="rounded-xl border border-white/25 bg-white/10 px-3 py-3 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">
                PARTNER VAULT
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                ${vaultBalance}
              </p>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-2xl">
              💝
            </div>
          </div>

          <p className="mt-3 text-sm text-white/70">
            Shared space for gifts, surprises, and special plans together.
          </p>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="rounded-xl bg-wb-green px-3 py-3 text-sm font-semibold text-black"
            >
              Tip / Add Money
            </button>

            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              disabled={!isWalletReady}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request Withdraw
            </button>
          </div>
        </section>
      </div>

      <BaseModal
        ariaLabel="Send to user"
        title="Send to user"
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      >
        <div className="mt-4">
          <label
            htmlFor="send-email"
            className="text-xs uppercase tracking-wide text-white/60"
          >
            Email
          </label>

          <input
            id="send-email"
            type="email"
            value={sendEmail}
            onChange={(event) => setSendEmail(event.target.value)}
            placeholder="partner@email.com"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />

          <button
            type="button"
            onClick={handleSend}
            className="mt-5 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </BaseModal>
    </MainLayout>
  )
}
