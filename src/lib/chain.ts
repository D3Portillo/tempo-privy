import { alphaUsd } from "@/constants"
import { tempoActions } from "tempo.ts/viem"
import { createPublicClient, defineChain, http } from "viem"

/** Tempo Moderato chain  */
export const tempo = defineChain({
  id: 42431,
  name: "Tempo Moderato",
  nativeCurrency: { name: "AlphaUSD", symbol: "aUSD", decimals: 6 },
  rpcUrls: {
    default: { http: ["https://rpc.moderato.tempo.xyz"] },
  },
  feeToken: alphaUsd,
})

export const clientTempo = createPublicClient({
  chain: tempo,
  transport: http(),
}).extend(tempoActions())
