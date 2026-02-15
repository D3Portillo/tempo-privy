"use client"

import { MainLayout } from "@/components/MainLayout"
import AddressBlock from "@/components/AddressBlock"
import { useStreakCount } from "@/state/streak"
import { useAuth } from "@/lib/wallet"
import { BsFillArrowThroughHeartFill } from "react-icons/bs"

export default function UsPage() {
  const { username } = useAuth()
  const [streakCount] = useStreakCount()

  const myName = username || "You"
  const partnerName = "Partner"
  const totalMoments = streakCount
  const longestStreak = streakCount
  const gamesPlayed = Math.max(1, Math.floor(streakCount / 2))

  return (
    <MainLayout>
      <h2 className="text-2xl font-semibold text-white">Our Love Story ✨</h2>

      <div className="mt-5 rounded-3xl border border-white/10 bg-linear-to-br from-fuchsia-400/20 via-violet-400/15 to-sky-400/15 p-4 pb-6">
        <div className="grid text-center grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-sm font-semibold text-white">{myName}</p>
            <figure className="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
              <AddressBlock name={myName} />
            </figure>
          </div>

          <div className="relative grid place-items-center">
            <BsFillArrowThroughHeartFill className="text-white text-3xl us-heartbeat" />
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-sm font-semibold text-white">{partnerName}</p>
            <figure className="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
              <AddressBlock name={partnerName} />
            </figure>
          </div>
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-white/10 bg-linear-to-br from-indigo-400/20 via-violet-400/10 to-pink-400/20">
        <div className="grid [&_div]:px-4 gap-5 py-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">
              <span className="text-white">🏆</span> Longest streak
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {longestStreak} days
            </p>
          </div>

          <div className="border-y py-4 sm:py-0 sm:border-y-0 sm:border-x border-white/20">
            <p className="text-xs uppercase tracking-wide text-white/60">
              <span className="text-white">🎮</span> Games played
            </p>
            <p className="mt-1 text-xl font-black text-white">{gamesPlayed}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">
              <span className="text-white">💞</span> Moments
            </p>
            <p className="mt-1 text-xl font-black text-white">{totalMoments}</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <article className="rounded-2xl border border-white/10 bg-linear-to-br from-wb-violet/30 to-pink-300/20 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Time together
          </p>
          <p className="mt-2 text-xl font-black text-white">452 days</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-linear-to-br from-wb-green/25 to-cyan-300/15 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Overall feeling
          </p>
          <p className="mt-2 text-lg font-black text-white">Great 💜</p>
        </article>
      </div>

      <style global>{`
        .us-heartbeat {
          transform-origin: center;
          animation: us-heartbeat 1.15s ease-in-out infinite;
        }

        @keyframes us-heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.18);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.12);
          }
          70% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </MainLayout>
  )
}
