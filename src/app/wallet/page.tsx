"use client"

import { useState } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { createWalletClient, custom, parseUnits, walletActions } from "viem"
import { tempoActions } from "tempo.ts/viem"

import { useWallets } from "@privy-io/react-auth"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"

import { MainLayout } from "@/components/MainLayout"
import { BaseModal } from "@/components/BaseModal"
import { TopUpModal } from "@/components/TopUpModal"
import { FiExternalLink } from "react-icons/fi"

import { localizeNumber } from "@/lib/number"
import { useBalance } from "@/hooks/useBalance"
import { useVaultWallet } from "@/hooks/useVaultWallet"
import { useAuth } from "@/lib/wallet"
import { alphaUsd } from "@/constants"
import { tempo } from "@/lib/chain"

const atomHistory = atomWithStorage(
  "wb.history",
  [] as Array<{
    id: string
    timestamp: number
    amount: number
    transactionHash: string
  }>,
)

export default function WalletPage() {
  const { evmAddress } = useAuth()
  const { wallets } = useWallets()
  const { vaultWallet, isWalletReady } = useVaultWallet()

  const {
    formattedBalance: walletBalance,
    balance: rawWalletBalance,
    formattedDecimals,
  } = useBalance(evmAddress)

  const { formattedBalance: vaultBalance } = useBalance(vaultWallet)

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

  const [txHistory, setTxHistory] = useAtom(atomHistory)

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

  const handleVaultTip = async () => {
    if (!vaultWallet) {
      toast.error("Sync with partner to enable withdrawals")
      return
    }

    const amount = Number(vaultTipAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Invalid amount")
      return
    }

    if (rawWalletBalance < amount) {
      toast.error("Insufficient wallet balance")
      return
    }

    console.debug({ wallets })
    const wallet = wallets.find((w) => w.connectorType === "embedded") || null

    if (!wallet) {
      toast.error("Wallet not found")
      return
    }

    const provider = await wallet.getEthereumProvider()
    const walletClient = createWalletClient({
      account: evmAddress!,
      chain: tempo,
      transport: custom(provider),
    })
      .extend(walletActions)
      .extend(tempoActions())

    const transactionHash = await walletClient.token.transfer({
      to: vaultWallet,
      amount: parseUnits(amount.toString(), formattedDecimals),
      token: alphaUsd,
    })

    console.debug({ transactionHash })

    setTxHistory((prev) => [
      {
        id: `tx-${Date.now()}`,
        timestamp: Date.now(),
        transactionHash,
        amount,
      },
      ...prev,
    ])

    toast.success(`Added $${amount.toFixed(2)} to Partner Vault`)
    setVaultTipAmount("")
    setIsVaultTipModalOpen(false)
  }

  const handleVaultWithdraw = async () => {
    const amount = Number(vaultWithdrawAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Add a valid amount")
      return
    }

    if (!vaultWithdrawReason.trim()) {
      toast.error("Add a reason for withdrawal")
      return
    }

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

        {txHistory.length > 0 ? (
          <section className="mt-24">
            <div className="border-t mb-6 border-white/10" />

            <h2 className="text-2xl font-semibold text-white mb-6">
              Transaction History
            </h2>

            <div className="space-y-2">
              {txHistory.map((tx) => (
                <article
                  key={`tx-${tx.id}`}
                  className="rounded-xl text-white border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Vault Transfer</p>

                      <p className="text-xs first-letter:capitalize text-white/60">
                        {formatDistanceToNow(new Date(tx.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold">
                        ${localizeNumber(tx.amount)}
                      </p>
                      <a
                        href={`https://explore.tempo.xyz/receipt/${tx.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open transaction"
                      >
                        <FiExternalLink className="text-lg" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
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
        ariaLabel="Vault Top-up"
        title="Vault Top-up"
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
