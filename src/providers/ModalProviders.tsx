"use client"

import { ModalPartnerSync } from "@/components/ModalPartnerSync"
import { Fragment, type PropsWithChildren } from "react"

export default function ModalProviders({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <ModalPartnerSync />
      {children}
    </Fragment>
  )
}
