"use server"

import {
  createInviteForAddress,
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
