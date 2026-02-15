import { Redis } from "@upstash/redis"
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto"
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

const KEY_SCOPE = "wb-app"
const KEYS_PARTNERS = {
  getPartnerInviteCode: (code: string) => `${KEY_SCOPE}:invite:${code}`,
  getCodeByUser: (address: string) => `${KEY_SCOPE}:code-by-user:${address}`,
  getGroupById: (groupId: string) => `${KEY_SCOPE}:group:${groupId}`,
  getGroupByMembers: (addressA: string, addressB: string) =>
    `${KEY_SCOPE}:group-members:${addressA}:${addressB}`,
  getVaultByGroupId: (groupId: string) => `${KEY_SCOPE}:vault:${groupId}`,
}

const MAIN_WALLET_PASS_KEY = process.env.MAIN_WALLET_PASS_KEY

const normalizeAddress = (value: string) => value.trim().toLowerCase()

const createCode = () =>
  `WB-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`

const getGroupById = (groupId: string) =>
  redis.get<Group>(KEYS_PARTNERS.getGroupById(groupId))

const getGroupIdByMembers = async (addressA: string, addressB: string) => {
  return (
    (await redis.get<string>(
      KEYS_PARTNERS.getGroupByMembers(addressA, addressB),
    )) ||
    (await redis.get<string>(
      KEYS_PARTNERS.getGroupByMembers(addressB, addressA),
    ))
  )
}

const getVaultByGroupId = (groupId: string) =>
  redis.get<Vault>(KEYS_PARTNERS.getVaultByGroupId(groupId))

const getAnyGroupIdByAddress = async (address: string) => {
  const normalized = normalizeAddress(address)

  const [forwardKeys, reverseKeys] = await Promise.all([
    redis.keys(KEYS_PARTNERS.getGroupByMembers(normalized, "*")),
    redis.keys(KEYS_PARTNERS.getGroupByMembers("*", normalized)),
  ])

  const anyPairKey = forwardKeys[0] || reverseKeys[0]
  if (!anyPairKey) return null

  const groupId = await redis.get<string>(anyPairKey)
  return groupId || null
}

const getGroupAndVaultByMembers = async (
  addressA: string,
  addressB: string,
) => {
  const normalizedA = normalizeAddress(addressA)
  const normalizedB = normalizeAddress(addressB)

  const groupId = await getGroupIdByMembers(normalizedA, normalizedB)
  if (!groupId) return null

  const group = await getGroupById(groupId)
  if (!group) return null

  const vault = await getVaultByGroupId(group.id)
  if (!vault) return null

  return { group, vault }
}

const encrypt = (value: string) => {
  if (!MAIN_WALLET_PASS_KEY) {
    throw new Error("MAIN_WALLET_PASS_KEY is required")
  }

  const iv = randomBytes(12)
  const salt = randomBytes(16)
  const key = scryptSync(MAIN_WALLET_PASS_KEY, salt, 32)
  const cipher = createCipheriv("aes-256-gcm", key, iv)

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ])
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

export const createInviteForAddress = async (address: string) => {
  const normalized = normalizeAddress(address)
  const previousCode = await redis.get<string>(
    KEYS_PARTNERS.getCodeByUser(normalized),
  )

  if (previousCode) {
    return previousCode
  }

  const code = createCode()
  await redis.set(KEYS_PARTNERS.getPartnerInviteCode(code), normalized)
  await redis.set(KEYS_PARTNERS.getCodeByUser(normalized), code)

  return code
}

export const redeemInviteForAddress = async (address: string, code: string) => {
  const invitee = normalizeAddress(address)
  const safeCode = code.trim().toUpperCase()

  if (!safeCode) {
    throw new Error("Invite code is required")
  }

  const inviter = await redis.get<string>(
    KEYS_PARTNERS.getPartnerInviteCode(safeCode),
  )
  if (!inviter) {
    throw new Error("Invite code not found")
  }

  if (inviter === invitee) {
    throw new Error("Cannot use your own invite code")
  }

  const existingGroupId = await getGroupIdByMembers(inviter, invitee)

  if (existingGroupId) {
    const existingGroup = await getGroupById(existingGroupId)

    if (existingGroup) {
      return existingGroup
    }
  }

  const groupId = crypto.randomUUID()
  const group: Group = {
    id: groupId,
    members: [inviter, invitee],
    createdAt: Date.now(),
  }

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

  await redis.set(KEYS_PARTNERS.getGroupById(groupId), group)
  await redis.set(KEYS_PARTNERS.getGroupByMembers(inviter, invitee), groupId)
  await redis.set(KEYS_PARTNERS.getVaultByGroupId(groupId), vault)

  return group
}

export const getVaultByMembers = async (addressA: string, addressB: string) => {
  const context = await getGroupAndVaultByMembers(addressA, addressB)
  if (!context) return null

  const { vault } = context

  return {
    groupId: vault.groupId,
    address: vault.address,
    createdAt: vault.createdAt,
  }
}

export const getAnyVaultByAddress = async (address: string) => {
  const groupId = await getAnyGroupIdByAddress(address)
  if (!groupId) return null

  const vault = await getVaultByGroupId(groupId)
  if (!vault) return null

  return {
    groupId: vault.groupId,
    address: vault.address,
    createdAt: vault.createdAt,
  }
}

export const getDecryptedVaultPrivateKeyByMembers = async (
  addressA: string,
  addressB: string,
) => {
  const context = await getGroupAndVaultByMembers(addressA, addressB)
  if (!context) return null

  const { vault } = context

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
