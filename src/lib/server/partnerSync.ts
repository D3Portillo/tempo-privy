import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

type Group = {
  id: string
  members: [string, string]
  createdAt: number
}

const normalizeAddress = (value: string) => value.trim().toLowerCase()

const createCode = () => `WB-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`

export const getGroupByAddress = async (address: string) => {
  const normalized = normalizeAddress(address)
  const groupId = await redis.get<string>(`partner:user-group:${normalized}`)

  if (!groupId) return null

  const group = await redis.get<Group>(`partner:group:${groupId}`)
  return group
}

export const createInviteForAddress = async (address: string) => {
  const normalized = normalizeAddress(address)
  const currentGroup = await getGroupByAddress(normalized)

  if (currentGroup) {
    throw new Error("User already has a partner group")
  }

  const previousCode = await redis.get<string>(`partner:code-by-user:${normalized}`)

  if (previousCode) {
    return previousCode
  }

  const code = createCode()
  await redis.set(`partner:invite:${code}`, normalized)
  await redis.set(`partner:code-by-user:${normalized}`, code)

  return code
}

export const redeemInviteForAddress = async (address: string, code: string) => {
  const invitee = normalizeAddress(address)
  const safeCode = code.trim().toUpperCase()

  if (!safeCode) {
    throw new Error("Invite code is required")
  }

  const inviteeGroup = await getGroupByAddress(invitee)
  if (inviteeGroup) {
    throw new Error("User already has a partner group")
  }

  const inviter = await redis.get<string>(`partner:invite:${safeCode}`)
  if (!inviter) {
    throw new Error("Invite code not found")
  }

  if (inviter === invitee) {
    throw new Error("Cannot use your own invite code")
  }

  const inviterGroup = await getGroupByAddress(inviter)
  if (inviterGroup) {
    throw new Error("Inviter already has a partner group")
  }

  const groupId = crypto.randomUUID()
  const group: Group = {
    id: groupId,
    members: [inviter, invitee],
    createdAt: Date.now(),
  }

  await redis.set(`partner:group:${groupId}`, group)
  await redis.set(`partner:user-group:${inviter}`, groupId)
  await redis.set(`partner:user-group:${invitee}`, groupId)
  await redis.del(`partner:invite:${safeCode}`)
  await redis.del(`partner:code-by-user:${inviter}`)

  return group
}