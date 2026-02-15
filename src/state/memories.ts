"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type MemoryLikes = Record<string, boolean>

const memoryLikesAtom = atomWithStorage<MemoryLikes>("memory-likes", {})

export function useMemoryLikes() {
  return useAtom(memoryLikesAtom)
}
