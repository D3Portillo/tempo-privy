"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { MainLayout } from "@/components/MainLayout"
import { BaseModal } from "@/components/BaseModal"
import { TopUpModal } from "@/components/TopUpModal"

import { useBalance } from "@/hooks/useBalance"
import { useVaultWallet } from "@/hooks/useVaultWallet"
import { useAuth } from "@/lib/wallet"

export default function WalletPage() {
  const { evmAddress } = useAuth()
  const { vaultWallet, isWalletReady } = useVaultWallet()

  const { balance: walletBalance } = useBalance(evmAddress)
  const { balance: vaultBalance } = useBalance(vaultWallet)

  const [vaultBalanceDemo, setVaultBalanceDemo] = useState(0)
  const [isVaultBalanceDemoReady, setIsVaultBalanceDemoReady] = useState(false)

  const [sendEmail, setSendEmail] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [vaultTipAmount, setVaultTipAmount] = useState("")
  const [vaultWithdrawAmount, setVaultWithdrawAmount] = useState("")
  const [vaultWithdrawReason, setVaultWithdrawReason] = useState("")
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [isVaultTipModalOpen, setIsVaultTipModalOpen] = useState(false)
  const [isVaultWithdrawModalOpen, setIsVaultWithdrawModalOpen] =
    useState(false)

  useEffect(() => {
    if (isVaultBalanceDemoReady) return

    const parsedVaultBalance = Number(vaultBalance.replaceAll(",", ""))
    if (!Number.isNaN(parsedVaultBalance)) {
      setVaultBalanceDemo(parsedVaultBalance)
      setIsVaultBalanceDemoReady(true)
    }
  }, [vaultBalance, isVaultBalanceDemoReady])

  const handleSend = () => {
    if (!sendEmail.trim()) {
      toast.error("Add an email first")
      return
    }

    if (!sendAmount.trim() || Number(sendAmount) <= 0) {
      toast.error("Add a valid amount")
      return
    }

    toast.success(`Sent $${sendAmount.trim()} to ${sendEmail.trim()}`)
    setSendEmail("")
    setSendAmount("")
    setIsSendModalOpen(false)
  }

  const handleVaultTip = () => {
    const amount = Number(vaultTipAmount)

    if (!vaultTipAmount.trim() || Number.isNaN(amount) || amount <= 0) {
      toast.error("Add a valid amount")
      return
    }

    setVaultBalanceDemo((prev) => prev + amount)
    toast.success(`Added $${amount.toFixed(2)} to Partner Vault`)
    setVaultTipAmount("")
    setIsVaultTipModalOpen(false)
  }

  const handleVaultWithdraw = () => {
    const amount = Number(vaultWithdrawAmount)

    if (!vaultWithdrawAmount.trim() || Number.isNaN(amount) || amount <= 0) {
      toast.error("Add a valid amount")
      return
    }

    if (amount > vaultBalanceDemo) {
      toast.error("Insufficient Partner Vault balance")
      return
    }

    if (!vaultWithdrawReason.trim()) {
      toast.error("Add a reason for withdrawal")
      return
    }

    setVaultBalanceDemo((prev) => prev - amount)
    toast.success("Withdraw request sent")
    setVaultWithdrawAmount("")
    setVaultWithdrawReason("")
    setIsVaultWithdrawModalOpen(false)
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
              onClick={() => setIsTopUpModalOpen(true)}
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
          <TopUpModal
            isOpen={isTopUpModalOpen}
            onClose={() => setIsTopUpModalOpen(false)}
            address={evmAddress || ""}
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">
                PARTNER VAULT
              </p>
              <p className="mt-2 text-4xl font-black text-white">
                ${vaultBalanceDemo.toFixed(2)}
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
              onClick={() => setIsVaultTipModalOpen(true)}
              className="rounded-xl bg-wb-green px-3 py-3 text-sm font-semibold text-black"
            >
              Tip / Add Money
            </button>

            <button
              type="button"
              onClick={() => setIsVaultWithdrawModalOpen(true)}
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

          <label
            htmlFor="send-amount"
            className="mt-4 block text-xs uppercase tracking-wide text-white/60"
          >
            Amount
          </label>

          <input
            id="send-amount"
            type="text"
            value={sendAmount}
            onChange={(event) => setSendAmount(event.target.value)}
            placeholder="0.00"
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

      <BaseModal
        ariaLabel="Tip / Add money"
        title="Tip / Add money"
        isOpen={isVaultTipModalOpen}
        onClose={() => setIsVaultTipModalOpen(false)}
      >
        <div className="mt-4">
          <label
            htmlFor="vault-tip-amount"
            className="text-xs uppercase tracking-wide text-white/60"
          >
            Amount
          </label>

          <input
            id="vault-tip-amount"
            type="text"
            value={vaultTipAmount}
            onChange={(event) => setVaultTipAmount(event.target.value)}
            placeholder="0.00"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />

          <button
            type="button"
            onClick={handleVaultTip}
            className="mt-5 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </BaseModal>

      <BaseModal
        ariaLabel="Withdraw funds"
        title="Withdraw funds"
        isOpen={isVaultWithdrawModalOpen}
        onClose={() => setIsVaultWithdrawModalOpen(false)}
      >
        <div className="mt-4">
          <label
            htmlFor="vault-withdraw-amount"
            className="text-xs uppercase tracking-wide text-white/60"
          >
            Amount
          </label>

          <input
            id="vault-withdraw-amount"
            type="text"
            value={vaultWithdrawAmount}
            onChange={(event) => setVaultWithdrawAmount(event.target.value)}
            placeholder="0.00"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />

          <label
            htmlFor="vault-withdraw-reason"
            className="mt-4 block text-xs uppercase tracking-wide text-white/60"
          >
            Reason for withdrawal
          </label>

          <textarea
            id="vault-withdraw-reason"
            value={vaultWithdrawReason}
            onChange={(event) => setVaultWithdrawReason(event.target.value)}
            placeholder="What is this withdrawal for?"
            className="mt-2 min-h-24 w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />

          <button
            type="button"
            onClick={handleVaultWithdraw}
            className="mt-5 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </BaseModal>
    </MainLayout>
  )
}
