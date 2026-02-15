"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { useAtom } from "jotai"

import { FaCheckCircle } from "react-icons/fa"

import MainActions from "@/components/MainActions"
import { QuizModal } from "@/components/Quiz"
import { MainLayout } from "@/components/MainLayout"

import { questionCompleteAtom, quizCompleteAtom } from "@/state/streak"
import { QuestionModal } from "@/components/Question"

import { useAuth } from "@/lib/wallet"

export default function Home() {
  const { isConnected, login } = useAuth()
  const [questionComplete] = useAtom(questionCompleteAtom)
  const [quizComplete] = useAtom(quizCompleteAtom)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const isQuestionCompleteToday = questionComplete === today
  const isQuizCompleteToday = quizComplete === today
  const isGameCompleteToday = isQuestionCompleteToday && isQuizCompleteToday

  const fireConfetti = () => {
    const base = {
      startVelocity: 35,
      spread: 70,
      ticks: 120,
      zIndex: 100,
      scalar: 1,
      colors: ["#22c55e", "#a78bfa", "#f43f5e", "#f59e0b", "#38bdf8"],
    }

    confetti({ ...base, particleCount: 80, origin: { x: 0.2, y: 0.7 } })
    confetti({ ...base, particleCount: 80, origin: { x: 0.8, y: 0.7 } })
  }

  useEffect(() => {
    if (!isGameCompleteToday) return

    const justCompleted = sessionStorage.getItem("streak-just-completed")
    if (justCompleted !== today) return

    toast.success("Streak complete")
    fireConfetti()
    sessionStorage.removeItem("streak-just-completed")
  }, [isGameCompleteToday, today])

  return (
    <MainLayout>
      <MainActions />

      <h2 className="text-2xl font-semibold text-white mb-6">
        Daily Activities
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 rounded-full top-4 bottom-8 w-0.5 bg-wb-green/25" />

        {/* Activity Cards */}
        <div className="space-y-4">
          {/* Question Card */}
          <div className="relative flex gap-4 opacity-100">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <FaCheckCircle
                  className={
                    "text-xl " +
                    (isQuestionCompleteToday
                      ? "text-wb-green"
                      : "text-slate-500")
                  }
                />
              </figure>
            </div>
            <button
              className={
                "flex-1 bg-purple-200 rounded-3xl p-5 relative overflow-hidden text-left transition-transform active:scale-98 " +
                (isQuestionCompleteToday
                  ? "opacity-80 grayscale saturate-150"
                  : "cursor-pointer")
              }
              disabled={isQuestionCompleteToday}
              onClick={() => {
                if (!isConnected) return login()
                setShowQuestion(true)
              }}
            >
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                Question
              </span>
              <h3 className="text-slate-900 text-lg font-bold leading-tight pr-24">
                What do you remember about the first time we met?
              </h3>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
                🤔
              </div>
            </button>
          </div>

          {/* Quiz Card */}
          <div className="relative flex gap-4 opacity-100">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <FaCheckCircle
                  className={
                    "text-xl " +
                    (isQuizCompleteToday ? "text-wb-green" : "text-slate-500")
                  }
                />
              </figure>
            </div>
            <button
              className={
                "flex-1 bg-orange-200 rounded-3xl p-5 relative overflow-hidden text-left transition-transform active:scale-98 " +
                (isQuizCompleteToday
                  ? "opacity-80 grayscale saturate-150"
                  : "cursor-pointer")
              }
              disabled={isQuizCompleteToday}
              onClick={() => {
                if (!isConnected) return login()
                setShowQuiz(true)
              }}
            >
              <span className="inline-block px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-full mb-3">
                Quiz
              </span>
              <h3 className="text-slate-900 text-lg font-bold leading-tight">
                Relationship Checkup
              </h3>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl">
                💝
              </div>
            </button>
          </div>

          {/* Game Card */}
          <div className="relative flex gap-4">
            <div className="relative z-10 shrink-0">
              <figure className="grid -mt-2 place-items-center p-1 bg-slate-900 w-7 h-10 rounded-full">
                <FaCheckCircle
                  className={
                    "text-xl " +
                    (isGameCompleteToday ? "text-wb-green" : "text-slate-500")
                  }
                />
              </figure>
            </div>
            <div className="flex-1 bg-yellow-100 rounded-3xl p-5 relative overflow-hidden text-left">
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

      <QuestionModal
        isOpen={showQuestion && !isQuestionCompleteToday}
        onComplete={() => setShowQuestion(false)}
      />
      <QuizModal
        isOpen={showQuiz && !isQuizCompleteToday}
        onComplete={() => setShowQuiz(false)}
      />
    </MainLayout>
  )
}
