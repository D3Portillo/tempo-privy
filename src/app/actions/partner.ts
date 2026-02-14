"use server"

import {
  createInviteForAddress,
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
