"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

import { BaseModal } from "./BaseModal"
import { FiCopy } from "react-icons/fi"
import { beautifyAddress, cn } from "@/lib/utils"

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

export function TopUpModal({
  isOpen,
  onClose,
  address,
}: {
  isOpen: boolean
  onClose: () => void
  address: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 800)
  }

  return (
    <BaseModal
      ariaLabel="Top-up wallet"
      title="Top-up wallet"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="mt-4">
        <div className="w-full aspect-square max-w-44 mx-auto bg-white rounded-xl p-3">
          <QRCode
            style={{ height: "100%", width: "100%" }}
            value={address}
            size={256}
          />
        </div>

        <div className="flex mt-10 items-center justify-between rounded-xl bg-black/60 px-3 py-2">
          <span className="text-white font-mono text-xs">
            {beautifyAddress(address, 9)}
          </span>
          <button
            onClick={handleCopy}
            aria-label="Copy address"
            className={cn(
              "rounded-lg active:scale-98 size-8 grid place-items-center text-white transition hover:bg-white/10",
              copied && "bg-white/10",
            )}
          >
            <FiCopy className="text-base" />
          </button>
        </div>

        <p className="text-xs text-center text-white/80 my-2">
          Send only USD to this address in Tempo chain. Otherwise funds may be
          lost.
        </p>
      </div>
    </BaseModal>
  )
}
