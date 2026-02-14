"use client"

import {
  FaHome,
  FaCalendarAlt,
  FaHeart,
  FaCheckCircle,
  FaGift,
} from "react-icons/fa"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-bold text-white">Home</h1>
        <button className="relative w-10 h-10 bg-wb-violet/20 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-wb-violet rounded-full" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-wb-red rounded-full text-sm flex items-center justify-center text-white font-bold">
            1
          </span>
        </button>
      </header>

      {/* Daily Activities */}
      <section className="px-6">
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
              <div className="relative z-10 flex-shrink-0">
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
              <div className="relative z-10 flex-shrink-0">
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
              <div className="relative z-10 flex-shrink-0">
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-indigo-950 px-6 py-3 pb-6">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-wb-violet">
            <FaHome className="text-xl" />
            <span className="text-sm">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <FaGift className="text-xl" />
            <span className="text-sm">Treats</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <FaCalendarAlt className="text-xl" />
            <span className="text-sm">Timeline</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <FaHeart className="text-xl" />
            <span className="text-sm">Us</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
