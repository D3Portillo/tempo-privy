"use client"

import { MainLayout } from "@/components/MainLayout"
import { useMemo, useState } from "react"
import { useWishes, type WishOwner } from "@/state/wishes"
import { cn } from "@/lib/utils"

export default function TreatsPage() {
  const [wishes, setWishes] = useWishes()
  const [activeTab, setActiveTab] = useState<WishOwner>("partner")
  const [wishInput, setWishInput] = useState("")

  const filteredWishes = useMemo(
    () => wishes.filter((wish) => wish.owner === activeTab),
    [activeTab, wishes],
  )

  const handleAddWish = () => {
    const text = wishInput.trim()
    if (!text) return

    setWishes((prev) => [
      {
        id: `wish-${Date.now()}`,
        text,
        owner: "mine",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    setWishInput("")
    setActiveTab("mine")
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveTab("mine")}
          className={cn(
            "border-b px-4 pb-3 text-sm transition-transform active:scale-98",
            activeTab === "mine"
              ? "text-white font-bold border-white"
              : "text-white/70 border-white/30",
          )}
        >
          Your Wishlist
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("partner")}
          className={cn(
            "border-b px-4 pb-3 text-sm transition-transform active:scale-98",
            activeTab === "partner"
              ? "text-white font-bold border-white"
              : "text-white/70 border-white/30",
          )}
        >
          Partner
        </button>
      </div>
      {activeTab === "mine" && (
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-white">Send a wish</h2>
          <textarea
            value={wishInput}
            onChange={(event) => setWishInput(event.target.value)}
            placeholder="I'd love you make me a lemon pie someday!"
            className="mt-3 min-h-24 w-full rounded-xl border border-white/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
          />

          <button
            type="button"
            onClick={handleAddWish}
            className="mt-3 w-full rounded-xl bg-wb-violet p-3 text-sm font-semibold text-white transition-transform active:scale-98"
          >
            Send Wish
          </button>
        </section>
      )}

      <section className="mt-5 space-y-2">
        {filteredWishes.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No wishes yet.
          </p>
        ) : (
          filteredWishes.map((wish) => (
            <article
              key={wish.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-sm font-semibold text-white">{wish.text}</p>
            </article>
          ))
        )}
      </section>
    </MainLayout>
  )
}
