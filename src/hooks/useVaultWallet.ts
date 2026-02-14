"use client"

import useSWR from "swr"
import type { Address } from "viem"

import { getVaultWalletAction } from "@/app/actions/partner"
import { useAuth } from "@/lib/wallet"

type UseVaultWalletResult = {
  vaultWallet: Address | null
  redeemBalance: (amount: bigint) => Promise<void>
}

export function useVaultWallet(): UseVaultWalletResult {
  const { evmAddress, isConnected } = useAuth()

  const { data } = useSWR(
    isConnected && evmAddress ? ["vault-wallet", evmAddress] : null,
    ([, address]) => getVaultWalletAction(address),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const vaultWallet = (data?.vaultWallet || null) as Address | null

  const redeemBalance = async (_amount: bigint) => {
    void _amount
    throw new Error("redeemBalance not implemented")
  }

  return {
    vaultWallet,
    redeemBalance,
  }
}
