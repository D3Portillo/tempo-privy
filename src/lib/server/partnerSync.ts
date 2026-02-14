import { Redis } from "@upstash/redis"
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"

const redis = Redis.fromEnv()

type Group = {
  id: string
  members: [string, string]
  createdAt: number
}

type Vault = {
  groupId: string
  address: string
  encryptedPrivateKey: string
  iv: string
  authTag: string
  salt: string
  createdAt: number
}

const normalizeAddress = (value: string) => value.trim().toLowerCase()

const createCode = () =>
  `WB-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`

const MAIN_WALLET_PASS_KEY = process.env.MAIN_WALLET_PASS_KEY

const encrypt = (value: string) => {
  if (!MAIN_WALLET_PASS_KEY) {
    throw new Error("MAIN_WALLET_PASS_KEY is required")
  }

  const iv = randomBytes(12)
  const salt = randomBytes(16)
  const key = scryptSync(MAIN_WALLET_PASS_KEY, salt, 32)
  const cipher = createCipheriv("aes-256-gcm", key, iv)

  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    encryptedValue: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
    authTag: authTag.toString("base64"),
  }
}

const decrypt = ({
  encryptedValue,
  iv,
  salt,
  authTag,
}: {
  encryptedValue: string
  iv: string
  salt: string
  authTag: string
}) => {
  if (!MAIN_WALLET_PASS_KEY) {
    throw new Error("MAIN_WALLET_PASS_KEY is required")
  }

  const key = scryptSync(MAIN_WALLET_PASS_KEY, Buffer.from(salt, "base64"), 32)
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64"),
  )
  decipher.setAuthTag(Buffer.from(authTag, "base64"))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64")),
    decipher.final(),
  ])

  return decrypted.toString("utf8")
}

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

  const previousCode = await redis.get<string>(
    `partner:code-by-user:${normalized}`,
  )

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

  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  const encryptedPrivateKey = encrypt(privateKey)

  const vault: Vault = {
    groupId,
    address: account.address.toLowerCase(),
    encryptedPrivateKey: encryptedPrivateKey.encryptedValue,
    iv: encryptedPrivateKey.iv,
    authTag: encryptedPrivateKey.authTag,
    salt: encryptedPrivateKey.salt,
    createdAt: Date.now(),
  }

  await redis.set(`partner:vault:${groupId}`, vault)

  await redis.del(`partner:invite:${safeCode}`)
  await redis.del(`partner:code-by-user:${inviter}`)

  return group
}

export const getVaultByAddress = async (address: string) => {
  const group = await getGroupByAddress(address)
  if (!group) return null

  const vault = await redis.get<Vault>(`partner:vault:${group.id}`)
  if (!vault) return null

  return {
    groupId: vault.groupId,
    address: vault.address,
    createdAt: vault.createdAt,
  }
}

export const getDecryptedVaultPrivateKeyByAddress = async (address: string) => {
  const group = await getGroupByAddress(address)
  if (!group) return null

  const vault = await redis.get<Vault>(`partner:vault:${group.id}`)
  if (!vault) return null

  const privateKey = decrypt({
    encryptedValue: vault.encryptedPrivateKey,
    iv: vault.iv,
    salt: vault.salt,
    authTag: vault.authTag,
  })

  return {
    groupId: vault.groupId,
    address: vault.address,
    privateKey,
  }
}
