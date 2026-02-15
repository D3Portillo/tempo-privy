"use client"

import { atom, useAtom } from "jotai"
import { applyContainerRules } from "@/lib/utils"
import { useEffect, useState } from "react"

import { FiEdit2, FiX } from "react-icons/fi"
import { IoIosFlame } from "react-icons/io"

const STREAK_PERIOD_OPTIONS = ["1 week", "1 month", "6 months"] as const
const REWARD_OPTIONS = [
  "movie night",
  "toy 🌶️",
  "trip",
  "dinner",
  "date nigth",
] as const
const AMOUNT_OPTIONS = ["$25", "$50", "$100", "other"] as const

type RewardConfig = {
  period: (typeof STREAK_PERIOD_OPTIONS)[number]
  reward: (typeof REWARD_OPTIONS)[number]
  amount: string
}

const atomIsOpen = atom(false)
export const useStreakSection = () => useAtom(atomIsOpen)

export function SectionStreak() {
  const [isOpen, setIsOpen] = useStreakSection()
  const [selectedPeriod, setSelectedPeriod] =
    useState<(typeof STREAK_PERIOD_OPTIONS)[number]>("1 week")
  const [selectedReward, setSelectedReward] =
    useState<(typeof REWARD_OPTIONS)[number]>("movie night")
  const [selectedAmount, setSelectedAmount] =
    useState<(typeof AMOUNT_OPTIONS)[number]>("$25")

  const [customAmount, setCustomAmount] = useState("")
  const [rewardConfig, setRewardConfig] = useState<RewardConfig | null>(null)
  const [isConfiguringReward, setIsConfiguringReward] = useState(false)
  const [freezeCount] = useState(0)

  const resolvedAmount =
    selectedAmount === "other"
      ? customAmount.trim() || "custom"
      : selectedAmount

  const handleConfirmReward = () => {
    setRewardConfig({
      period: selectedPeriod,
      reward: selectedReward,
      amount: resolvedAmount,
    })
    setIsConfiguringReward(false)
  }

  useEffect(() => {
    // Reset to defaults when opening the modal
    if (isOpen) {
      setIsConfiguringReward(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <section className="fixed bg-indigo-950 inset-0 z-40">
      <div
        className={applyContainerRules(
          "absolute inset-x-0 bottom-0 h-dvh overflow-y-auto text-white",
        )}
      >
        <div className="bg-purple-200 sm:rounded-b-3xl px-6 py-6 text-indigo-950">
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

        <div className="px-6 space-y-7 py-6">
          <section>
            <h3 className="text-xl font-bold">Streak Reward</h3>
            <p className="mt-2 text-sm opacity-70">
              What if a 7-day streak unlocks a date night, or a month unlocks
              dinner together?
            </p>

            {!isConfiguringReward ? (
              rewardConfig ? (
                <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/20 bg-white/5 p-4">
                  <p className="text-sm text-white/85">
                    {rewardConfig.period} • {rewardConfig.reward} •{" "}
                    {rewardConfig.amount}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsConfiguringReward(true)}
                    aria-label="Edit reward"
                    className="rounded-lg border border-white/20 bg-white/5 p-2 text-white/90"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfiguringReward(true)}
                  className="mt-4 w-full rounded-xl border border-white/25 bg-white/5 p-3 text-sm font-semibold text-white"
                >
                  CONFIGURE
                </button>
              )
            ) : (
              <div className="mt-4 rounded-3xl border border-white/20 bg-white/5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Streak period
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {STREAK_PERIOD_OPTIONS.map((option) => {
                      const isActive = selectedPeriod === option

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedPeriod(option)}
                          className={
                            isActive
                              ? "rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-sm font-semibold text-white"
                              : "rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm font-semibold text-white/80"
                          }
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="reward-select"
                    className="text-xs uppercase tracking-wide text-white/60"
                  >
                    Reward
                  </label>
                  <select
                    id="reward-select"
                    value={selectedReward}
                    onChange={(event) =>
                      setSelectedReward(
                        event.target.value as (typeof REWARD_OPTIONS)[number],
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none"
                  >
                    {REWARD_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-indigo-950 text-white"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Amount
                  </p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {AMOUNT_OPTIONS.map((option) => {
                      const isActive = selectedAmount === option

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedAmount(option)}
                          className={
                            isActive
                              ? "rounded-xl border border-white/40 bg-white/15 px-3 py-2 text-sm font-semibold text-white"
                              : "rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm font-semibold text-white/80"
                          }
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {selectedAmount === "other" ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Enter amount"
                      className="mt-3 w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                    />
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleConfirmReward}
                  className="mt-5 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
                >
                  Confirm
                </button>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-bold">Streak Freeze</h3>

            <p className="mt-2 text-sm opacity-70">
              Protect your streak with a freeze. It's like insurance for your
              consistency (Max 2).
            </p>

            <div className="mt-4 rounded-3xl border border-white/20 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <IoIosFlame className="text-xl scale-125 text-[#00f3ff]" />
                  <span>{freezeCount}/2 Available</span>
                </p>

                {freezeCount < 2 ? (
                  <button
                    type="button"
                    className="text-sm font-semibold uppercase tracking-wide text-white"
                  >
                    Setup
                  </button>
                ) : null}
              </div>
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
