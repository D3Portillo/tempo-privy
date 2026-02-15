"use client"

import { useAtom } from "jotai"
import { questionCompleteAtom } from "@/state/streak"
import { useState } from "react"

export function QuestionModal({
  isOpen,
  onComplete,
}: {
  isOpen: boolean
  onComplete: () => void
}) {
  const [, setQuestionComplete] = useAtom(questionCompleteAtom)
  const [response, setResponse] = useState("")

  if (!isOpen) return null

  const handleSend = () => {
    setQuestionComplete(new Date().toISOString().slice(0, 10))
    onComplete()
  }

  return (
    <div className="fixed inset-0 p-4 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          Question of the Day
        </h2>
        <p className="mb-4 text-indigo-900">
          What do you remember about the first time we met?
        </p>
        <textarea
          className="w-full rounded-xl border border-indigo-200 bg-white p-3 text-indigo-900 mb-4 min-h-20"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your answer..."
        />
        <button
          className="w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white"
          onClick={handleSend}
          disabled={!response.trim()}
        >
          Send Response
        </button>
      </div>
    </div>
  )
}
