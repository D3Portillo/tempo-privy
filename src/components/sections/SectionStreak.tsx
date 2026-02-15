"use client"

import { atom, useAtom } from "jotai"
import { FiX } from "react-icons/fi"

const atomIsOpen = atom(false)
export const useStreakSection = () => useAtom(atomIsOpen)

export function SectionStreak() {
  const [isOpen, setIsOpen] = useStreakSection()

  if (!isOpen) return null

  return (
    <section className="fixed bg-indigo-950 inset-0 z-40">
      <div className="absolute inset-x-0 bottom-0 h-dvh overflow-y-auto text-white">
        <div className="bg-purple-200 px-6 py-6 text-indigo-950">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold">Streak</h2>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close streak"
              className="rounded-full bg-indigo-900/80 p-2 text-white"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="grid shrink-0 size-24 place-items-center rounded-full bg-indigo-950 text-5xl">
              🔥
            </div>

            <div>
              <p className="text-2xl font-black">1 day</p>
              <p className="mt-1 text-sm text-indigo-900/80">
                Well done for investing in your relationship today!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-5 py-6">
          <section>
            <h3 className="text-xl font-bold">Streak Reward</h3>

            <div className="mt-4 rounded-3xl border border-white/20 bg-white/5 p-6">
              <div className="text-5xl">🧊</div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold">Streak Freeze</h3>

            <div className="mt-4 rounded-3xl border border-white/20 bg-white/5 p-6">
              <div className="text-5xl">🧊</div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold">Activity Calendar</h3>

            <div className="h-96 mt-4 rounded-2xl border border-white/15 bg-white/5" />
          </section>
        </div>
      </div>
    </section>
  )
}
