"use client"

import useSWR from "swr"
import type { Address } from "viem"

import {
  getVaultWalletAction,
  redeemVaultBalanceAction,
} from "@/app/actions/partner"
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

  const redeemBalance = async (amount: bigint) => {
    if (!evmAddress) {
      throw new Error("No active wallet")
    }

    await redeemVaultBalanceAction(evmAddress, amount.toString())
  }

  return {
    vaultWallet,
    redeemBalance,
  }
}
