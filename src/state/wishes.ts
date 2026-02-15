"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type WishOwner = "mine" | "partner"

export type WishItem = {
  id: string
  text: string
  owner: WishOwner
  createdAt: string
}

const initialWishes: WishItem[] = [
  {
    id: "wish-nintendo-switch",
    text: "A Nintendo Switch",
    owner: "partner",
    createdAt: "2026-02-10",
  },
  {
    id: "wish-tacos",
    text: "Tacoooos!",
    owner: "mine",
    createdAt: "2026-02-12",
  },
  {
    id: "wish-lemon-pie",
    text: "Lemon pie 😋",
    owner: "partner",
    createdAt: "2026-02-14",
  },
]

const wishesAtom = atomWithStorage<WishItem[]>("gift-wishes", initialWishes)

export function useWishes() {
  return useAtom(wishesAtom)
}
