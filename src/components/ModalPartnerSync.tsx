"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { FiCopy, FiX } from "react-icons/fi"

import { cn } from "@/lib/utils"
import { atom, useAtom } from "jotai"

const INVITE_CODE = "WB-MOCK-2026"

const atomModalPartnerSync = atom(false)
export const useModalPartnerSync = () => useAtom(atomModalPartnerSync)

export function ModalPartnerSync() {
  const [isOpen, setIsOpen] = useModalPartnerSync()
  const [copiedType, setCopiedType] = useState<"code" | "link" | null>(null)
  const [activeTab, setActiveTab] = useState<"have-code" | "share-code">(
    "share-code",
  )

  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(INVITE_CODE)

    setCopiedType("code")

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current)
    }

    copiedTimeoutRef.current = setTimeout(() => {
      setCopiedType(null)
    }, 300)
  }

  const handleCopyLink = async () => {
    const inviteLink = `${window.location.origin}/invite?code=${INVITE_CODE}`

    await navigator.clipboard.writeText(inviteLink)
    setCopiedType("link")

    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current)
    }

    copiedTimeoutRef.current = setTimeout(() => {
      setCopiedType(null)
    }, 300)
  }

  useEffect(() => {
    if (isOpen) {
      // Reset to default state when modal opens
      setCopiedType(null)
      setActiveTab("share-code")
    }
  }, [isOpen])

  if (isOpen) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Invite partner"
        className="fixed bg-black/20 backdrop-blur inset-0 z-30 flex items-start justify-center px-6 pt-24"
      >
        <button
          aria-label="Close invite partner modal"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0"
        />

        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-800/95 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              💕 Partner sync
            </h3>

            <button
              aria-label="Close modal"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white transition hover:bg-white/10"
            >
              <FiX className="text-lg" />
            </button>
          </div>

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
                  <p className="text-xl font-bold text-white">{INVITE_CODE}</p>

                  <button
                    onClick={handleCopyCode}
                    aria-label="Copy code"
                    className={cn(
                      "rounded-lg p-2 text-white transition hover:bg-white/10",
                      copiedType === "code" && "bg-white/10",
                    )}
                  >
                    <FiCopy className="text-base" />
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
                {copiedType === "link" ? "Copied" : "Copy Link"}
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
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-white outline-none placeholder:text-white/40"
              />

              <button className="mt-4 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white">
                Sync now
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
