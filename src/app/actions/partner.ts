"use server"

import { tempoActions } from "tempo.ts/viem"
import { createWalletClient, http, stringToHex, type Address } from "viem"
import { privateKeyToAccount } from "viem/accounts"

import { clientTempo, tempo } from "@/lib/chain"
import { alphaUsd } from "@/constants"
import {
  createInviteForAddress,
  getDecryptedVaultPrivateKeyByAddress,
  getVaultByAddress,
  redeemInviteForAddress,
} from "@/lib/server/partnerSync"

export const createInviteAction = async (evmAddress: string) => {
  const code = await createInviteForAddress(evmAddress)

  return {
    code,
    link: `/invite?code=${code}`,
  }
}

export const redeemInviteAction = async (evmAddress: string, code: string) => {
  await redeemInviteForAddress(evmAddress, code)
  return {
    ok: true,
  }
}

export const getVaultWalletAction = async (evmAddress: string) => {
  const vault = await getVaultByAddress(evmAddress)
  return {
    vaultWallet: vault?.address || null,
  }
}

export const redeemVaultBalanceAction = async (
  evmAddress: string,
  amount: string,
) => {
  const vault = await getDecryptedVaultPrivateKeyByAddress(evmAddress)
  if (!vault) {
    throw new Error("Vault wallet not found")
  }

  const account = privateKeyToAccount(vault.privateKey as Address)
  const client = createWalletClient({
    account,
    chain: tempo,
    transport: http(),
  }).extend(tempoActions())

  const metadata = await clientTempo.token.getMetadata({ token: alphaUsd })

  const { receipt } = await client.token.transferSync({
    to: evmAddress as Address,
    amount: BigInt(amount),
    memo: stringToHex("vault-redeem"),
    token: alphaUsd,
  })

  return {
    ok: true,
    txHash: receipt.transactionHash,
    decimals: metadata.decimals,
  }
}
