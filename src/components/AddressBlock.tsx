"use client"

import { Facehash, type FacehashProps } from "facehash"

export default function AddressBlock({ ...props }: FacehashProps) {
  return (
    <Facehash
      colors={["#d233e6", "#fffd82", "#7b5cff", "#aeffd8"]}
      enableBlink
      size="100%"
      {...props}
    />
  )
}
