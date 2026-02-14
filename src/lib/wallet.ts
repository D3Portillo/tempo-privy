"use client"

import type { Address } from "viem"
import { usePrivy } from "@privy-io/react-auth"

import { beautifyAddress } from "./utils"

export const useAuth = () => {
  const { user, authenticated: isConnected, ...privy } = usePrivy()
  const EVM_ADDRESS = user?.wallet?.address || null

  const WEB2_DATA = (user?.linkedAccounts?.find((account) =>
    ["email", "google_oauth"].includes(account.type),
  ) || null) as {
    email?: string
    name?: string
  } | null

  const EMAIL = WEB2_DATA?.email
  const NAME = WEB2_DATA?.name

  const formattedAddress = EVM_ADDRESS
    ? beautifyAddress(EVM_ADDRESS)
    : "Loading..."

  const username = NAME || EMAIL || formattedAddress

  return {
    ...privy,
    user,
    username,
    evmAddress: EVM_ADDRESS as Address | null,
    formattedEvmAddress: formattedAddress,
    isConnected,
  }
}
