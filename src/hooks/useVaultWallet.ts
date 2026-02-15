"use client"

import useSWR from "swr"
import type { Address } from "viem"

import { getAnyVaultWalletAction } from "@/app/actions/partner"
import { useAuth } from "@/lib/wallet"

type UseVaultWalletResult = {
  vaultWallet: Address | null
  redeemBalance: (amount: bigint) => Promise<void>
}

export function useVaultWallet(): UseVaultWalletResult {
  const { evmAddress, isConnected } = useAuth()

  const { data: vaultData } = useSWR(
    isConnected && evmAddress ? ["any-vault", evmAddress] : null,
    ([, address]) => getAnyVaultWalletAction(address),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const vaultWallet = (vaultData?.vaultWallet || null) as Address | null

  const redeemBalance = async (amount: bigint) => {
    if (!evmAddress) {
      throw new Error("No active wallet")
    }
  }

  return {
    vaultWallet,
    redeemBalance,
  }
}
