"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const streakCountAtom = atomWithStorage<number>("streak-count", 0)
export const questionCompleteAtom = atomWithStorage<string>(
  "streak-question-complete",
  "",
)

export const quizCompleteAtom = atomWithStorage<string>(
  "streak-quiz-complete",
  "",
)

// Hook to get the current streak count (reactive)
export function useStreakCount() {
  return useAtom(streakCountAtom)
}
