"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FiCopy } from "react-icons/fi"
import { toast } from "sonner"
import useSWR from "swr"

import { createInviteAction, redeemInviteAction } from "@/app/actions/partner"
import { useAuth } from "@/lib/wallet"
import { cn } from "@/lib/utils"
import { atom, useAtom } from "jotai"

import { BaseModal } from "./BaseModal"
import Spinner from "./Spinner"
import { BsBalloonHeartFill } from "react-icons/bs"

const atomModalPartnerSync = atom(false)
export const useModalPartnerSync = () => useAtom(atomModalPartnerSync)

const DEFAULT_INVITE_CODE = "WB-AB000000"
export function ModalPartnerSync() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { evmAddress, isConnected } = useAuth()
  const [isOpen, setIsOpen] = useModalPartnerSync()
  const [isSynced, setIsSynced] = useState(false)
  const [copiedType, setCopiedType] = useState<"code" | "link" | null>(null)
  const [activeTab, setActiveTab] = useState<"have-code" | "share-code">(
    "share-code",
  )
  const [partnerCode, setPartnerCode] = useState("")

  const inviteCodeFromQuery = searchParams.get("invite-code")

  const { data: inviteData } = useSWR(
    isOpen && isConnected && evmAddress
      ? ["partner-invite-code", evmAddress]
      : null,
    ([, address]) => createInviteAction(address),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  const inviteCode = inviteData?.code

  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyCode = async () => {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)

    setCopiedType("code")

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current)
    }

    copiedTimeoutRef.current = setTimeout(() => {
      setCopiedType(null)
    }, 300)
  }

  const handleCopyLink = async () => {
    if (!inviteCode) return
    const inviteLink = `${window.location.origin}/?invite-code=${inviteCode}`

    await navigator.clipboard.writeText(inviteLink)
    setCopiedType("link")

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current)
    }

    copiedTimeoutRef.current = setTimeout(() => {
      setCopiedType(null)
    }, 300)
  }

  const handleCloseModal = () => {
    setIsOpen(false)

    if (!inviteCodeFromQuery) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete("invite-code")

    const nextUrl = nextParams.size
      ? `${pathname}?${nextParams.toString()}`
      : pathname

    router.replace(nextUrl, { scroll: false })
  }

  useEffect(() => {
    if (isOpen) {
      setIsSynced(false)
      setCopiedType(null)

      if (inviteCodeFromQuery) {
        setActiveTab("have-code")
        setPartnerCode(inviteCodeFromQuery)
      } else {
        setActiveTab("share-code")
        setPartnerCode("")
      }
    }
  }, [isOpen, inviteCodeFromQuery])

  useEffect(() => {
    if (!inviteCodeFromQuery) return

    setIsOpen(true)
    setIsSynced(false)
    setCopiedType(null)
    setActiveTab("have-code")
    setPartnerCode(inviteCodeFromQuery)
  }, [inviteCodeFromQuery, setIsOpen])

  const handleSyncNow = async () => {
    if (!isConnected || !evmAddress || !partnerCode.trim()) return

    redeemInviteAction(evmAddress, partnerCode)
      .then(() => {
        setIsSynced(true)
      })
      .catch((error) => {
        toast.error("Invalid Code")

        console.error(error)
      })
  }

  if (isOpen) {
    if (isSynced) {
      return (
        <BaseModal
          ariaLabel="Partner connected"
          title="❤️ You're connected"
          isOpen={isOpen}
          onClose={handleCloseModal}
        >
          <p className="mt-5 border-t border-white/10 pt-5 text-center text-sm text-white/80">
            Let's keep the love firing up, set up a personal streak and a reward
            for both to enjoy.
          </p>

          <BsBalloonHeartFill className="mx-auto mt-6 text-6xl text-white" />

          <button
            onClick={handleCloseModal}
            className="mt-8 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
          >
            Setup Streak
          </button>
        </BaseModal>
      )
    }

    return (
      <BaseModal
        ariaLabel="Invite partner"
        title="Invite partner"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <Fragment>
          <div className="mt-4 grid grid-cols-2 rounded-xl border border-white/10 bg-slate-900/40 p-1">
            <button
              onClick={() => setActiveTab("have-code")}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-white transition",
                activeTab === "have-code" && "bg-white/10",
              )}
            >
              I have code
            </button>

            <button
              onClick={() => setActiveTab("share-code")}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-white transition",
                activeTab === "share-code" && "bg-white/10",
              )}
            >
              Share my code
            </button>
          </div>

          {activeTab === "share-code" ? (
            <Fragment>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  YOUR CODE
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xl font-bold text-white">
                    {inviteCode || DEFAULT_INVITE_CODE}
                  </p>

                  <button
                    onClick={handleCopyCode}
                    disabled={!inviteCode}
                    aria-label="Copy code"
                    className={cn(
                      "rounded-lg active:scale-98 size-8 grid place-items-center text-white transition hover:bg-white/10",
                      copiedType === "code" && "bg-white/10",
                    )}
                  >
                    {inviteCode ? (
                      <FiCopy className="text-base scale-105" />
                    ) : (
                      <Spinner themeSize="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopyLink}
                className={cn(
                  "mt-4 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white",
                  copiedType === "link" && "bg-wb-violet/90",
                )}
              >
                {copiedType === "link" ? "Copied" : "Copy Invite Link"}
              </button>
            </Fragment>
          ) : (
            <div className="mt-4">
              <label
                htmlFor="partner-invite-code"
                className="mb-2 block text-xs uppercase tracking-wide text-white/60"
              >
                Enter code
              </label>
              <input
                id="partner-invite-code"
                type="text"
                placeholder="WB-XXXX-XXXX"
                value={partnerCode}
                onChange={(event) => setPartnerCode(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-white outline-none placeholder:text-white/40"
              />

              <button
                onClick={handleSyncNow}
                className="mt-4 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
              >
                Confirm Sync
              </button>
            </div>
          )}
        </Fragment>
      </BaseModal>
    )
  }

  return null
}
