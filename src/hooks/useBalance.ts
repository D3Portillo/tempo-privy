"use client"

import useSWR from "swr"
import { Address, formatUnits } from "viem"
import { Abis } from "tempo.ts/viem"

import { clientTempo } from "@/lib/chain"
import { localizeNumber } from "@/lib/number"
import { alphaUsd } from "@/constants"

export function useBalance(address?: string | null) {
  const { data: result = null, ...query } = useSWR(
    address ? ["alpha-usd-balance", address] : null,
    async ([, walletAddress]) => {
      const [rawBalance, decimals] = await Promise.all([
        clientTempo.readContract({
          address: alphaUsd,
          abi: Abis.tip20,
          functionName: "balanceOf",
          args: [walletAddress as Address],
        }) as Promise<bigint>,
        clientTempo.readContract({
          address: alphaUsd,
          abi: Abis.tip20,
          functionName: "decimals",
        }) as Promise<number>,
      ])

      return {
        balance: formatUnits(rawBalance, decimals),
        decimals,
      }
    },
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const BALANCE = result?.balance || "0"
  return {
    ...query,
    formattedBalance: BALANCE == "0" ? "0.00" : localizeNumber(BALANCE),
    formattedDecimals: result?.decimals || 18,
    balance: Number(BALANCE),
  }
}
