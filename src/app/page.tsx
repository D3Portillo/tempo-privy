import { FaCheckCircle, FaChevronRight } from "react-icons/fa"
import { MainLayout } from "@/components/MainLayout"
import { BsEnvelopeOpenHeartFill } from "react-icons/bs"

export default function Home() {
  return (
    <MainLayout>
      <nav className="mb-6">
        <button className="rounded-xl text-white w-full px-4 py-3 justify-between bg-linear-to-br from-red-700 to-wb-violet flex items-center">
          <BsEnvelopeOpenHeartFill className="text-2xl" />
          <h2>Let's invite your partner</h2>
          <FaChevronRight />
        </button>
      </nav>

      <h2 className="text-2xl font-semibold text-white mb-6">
        Daily Activities
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 rounded-full top-4 bottom-8 w-0.5 bg-wb-green/30" />

        {/* Activity Cards */}
        <div className="space-y-4">
          {/* Question Card */}
          <div className="relative flex gap-4">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <FaCheckCircle className="text-xl text-wb-green" />
              </figure>
            </div>
            <div className="flex-1 bg-purple-200 rounded-3xl p-5 relative overflow-hidden">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                Question
              </span>
              <h3 className="text-slate-900 text-lg font-bold leading-tight pr-24">
                What do you remember about the first time we met?
              </h3>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
                🤔
              </div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="relative flex gap-4">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <FaCheckCircle className="text-xl text-wb-green" />
              </figure>
            </div>

            <div className="flex-1 bg-orange-200 rounded-3xl p-5 relative overflow-hidden">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                Quiz
              </span>
              <h3 className="text-slate-900 text-lg font-bold leading-tight">
                Relationship Checkup
              </h3>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
                💝
              </div>
            </div>
          </div>

          {/* Game Card */}
          <div className="relative flex gap-4">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <div className="size-5 grid place-items-center border-2 border-wb-violet rounded-full">
                  <div className="bg-wb-violet size-2 rounded-full" />
                </div>
              </figure>
            </div>

            <div className="flex-1 bg-yellow-100 rounded-3xl p-5 relative overflow-hidden">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                Game
              </span>
              <h3 className="text-slate-900 text-xl font-bold leading-tight pr-24">
                You or Me?
                <br />
                Character Traits
              </h3>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
                😈
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
