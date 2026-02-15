"use client"

import { ModalPartnerSync } from "@/components/ModalPartnerSync"
import { ModalPartnerVault } from "@/components/ModalPartnerVault"
import { Fragment, type PropsWithChildren } from "react"
import { Toaster } from "sonner"

export default function ModalProviders({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Toaster
        swipeDirections={["bottom", "top", "left", "right"]}
        position="top-center"
        theme="light"
        richColors={false}
      />
      <ModalPartnerSync />
      <ModalPartnerVault />

      {children}
    </Fragment>
  )
}
