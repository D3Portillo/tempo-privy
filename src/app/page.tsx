import { FaCheckCircle } from "react-icons/fa"
import { MainLayout } from "@/components/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      {/* Daily Activities */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Daily Activities
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-wb-green" />

          {/* Activity Cards */}
          <div className="space-y-4">
            {/* Question Card */}
            <div className="relative flex gap-4">
              <div className="relative z-10 shrink-0">
                <FaCheckCircle className="w-6 h-6 text-wb-green" />
              </div>
              <div className="flex-1 bg-purple-200 rounded-3xl p-5 relative overflow-hidden">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                  Question
                </span>
                <h3 className="text-slate-900 text-lg font-bold leading-tight pr-24">
                  What do you remember about the first time you met?
                </h3>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="w-10 h-10 bg-rose-300 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm -ml-3 border-2 border-purple-200">
                    K
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <FaCheckCircle className="w-5 h-5 text-wb-green" />
                </div>
              </div>
            </div>

            {/* Quiz Card */}
            <div className="relative flex gap-4">
              <div className="relative z-10 shrink-0">
                <FaCheckCircle className="w-6 h-6 text-wb-green" />
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
                <div className="absolute bottom-3 right-3">
                  <FaCheckCircle className="w-5 h-5 text-wb-green" />
                </div>
              </div>
            </div>

            {/* Game Card */}
            <div className="relative flex gap-4">
              <div className="relative z-10 shrink-0">
                <div className="w-6 h-6 rounded-full border-2 border-wb-violet bg-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-wb-violet rounded-full" />
                </div>
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2">
                  <div className="w-12 h-8 bg-purple-400 rounded-full rotate-12" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-purple-200 rounded -rotate-6" />
                    <div className="w-10 h-8 bg-white border-2 border-purple-300 rounded rotate-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
