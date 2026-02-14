"use client"

import type { PropsWithChildren } from "react"
import { FiX } from "react-icons/fi"

import { cn } from "@/lib/utils"

type BaseModalProps = PropsWithChildren<{
  ariaLabel: string
  title: string
  isOpen: boolean
  onClose: () => void
  contentClassName?: string
}>

export function BaseModal({
  ariaLabel,
  title,
  isOpen,
  onClose,
  children,
  contentClassName,
}: BaseModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-30 flex items-start justify-center bg-black/20 px-3 pt-24 backdrop-blur"
    >
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-800/95 p-5 shadow-lg",
          contentClassName,
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>

          <button
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-lg p-1 text-white transition hover:bg-white/10"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
