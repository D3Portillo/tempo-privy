"use client"

import { useAtom } from "jotai"
import { quizCompleteAtom, streakCountAtom } from "@/state/streak"
import { Fragment, useState } from "react"

const QUESTIONS = [
  "How connected do you feel to your partner today?",
  "How much fun did you have together recently?",
  "How supported do you feel in your relationship?",
]

export function QuizModal({
  isOpen,
  onComplete,
}: {
  isOpen: boolean
  onComplete: () => void
}) {
  const [, setQuizComplete] = useAtom(quizCompleteAtom)
  const [, setStreakCount] = useAtom(streakCountAtom)
  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const handleAnswer = (value: number) => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setStep(QUESTIONS.length) // move to claim slide
    }
  }

  const handleClaim = () => {
    setQuizComplete(new Date().toISOString().slice(0, 10))
    setStreakCount((count) => count + 1)
    setStep(QUESTIONS.length + 1)
  }

  return (
    <div className="fixed inset-0 p-4 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {step < QUESTIONS.length ? (
          <Fragment>
            <h2 className="text-xl font-bold text-indigo-900 mb-4">
              Quick Quiz
            </h2>
            <p className="mb-4 text-indigo-900">{QUESTIONS[step]}</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  className="rounded-full w-10 h-10 bg-wb-violet text-white font-bold text-lg active:scale-98 transition-transform"
                  onClick={() => handleAnswer(val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="mt-6 text-center text-xs text-indigo-900/60">
              Step {step + 1} of {QUESTIONS.length}
            </div>
          </Fragment>
        ) : step === QUESTIONS.length ? (
          <section className="mt-2 text-center">
            <h2 className="text-xl font-bold mb-2 text-indigo-900">
              Claim your streak
            </h2>
            <p className="mb-6 text-indigo-900/80">
              You finished today's quiz. Tap below to claim your streak.
            </p>
            <button
              className="w-full rounded-xl bg-wb-violet text-white font-bold py-3 mt-4 active:scale-98 transition-transform"
              onClick={handleClaim}
            >
              Claim Streak
            </button>
          </section>
        ) : (
          <section className="mt-2 text-center">
            <h2 className="text-xl font-bold mb-2 text-indigo-900">Awesome.</h2>
            <p className="mb-6 text-indigo-900/80">
              You have completed your daily streak. Come back tomorrow!
            </p>
            <button
              className="w-full rounded-xl bg-wb-violet text-white font-bold py-3 mt-4 active:scale-98 transition-transform"
              onClick={() => {
                onComplete()
                setStep(0)
              }}
            >
              Close
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
