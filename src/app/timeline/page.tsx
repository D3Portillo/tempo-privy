"use client"

import { MainLayout } from "@/components/MainLayout"
import { cn } from "@/lib/utils"
import { useMemoryLikes } from "@/state/memories"
import { IoHeart } from "react-icons/io5"

const memoryPhotos = [
  { id: "beach-day", src: "https://picsum.photos/seed/beach-day/800/800" },
  { id: "coffee-date", src: "https://picsum.photos/seed/coffee-date/800/800" },
  { id: "road-trip", src: "https://picsum.photos/seed/road-trip/800/800" },
  { id: "movie-night", src: "https://picsum.photos/seed/movie-night/800/800" },
  { id: "park-walk", src: "https://picsum.photos/seed/park-walk/800/800" },
  { id: "sunset", src: "https://picsum.photos/seed/sunset/800/800" },
]

export default function TimelinePage() {
  const [likes, setLikes] = useMemoryLikes()

  const toggleLike = (memoryId: string) => {
    setLikes((prev) => {
      if (prev[memoryId]) {
        const { [memoryId]: _, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [memoryId]: true,
      }
    })
  }

  return (
    <MainLayout>
      <h2 className="text-2xl font-semibold text-white">Memories</h2>
      <p className="mt-1 text-sm text-white/70">
        Your shared registry of good moments together
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {memoryPhotos.map((photo) => (
          <article
            key={photo.id}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="aspect-square">
              <img
                src={photo.src}
                loading="lazy"
                className="size-full object-cover"
                alt=""
              />
            </div>

            <div className="absolute right-2 top-2">
              <button
                type="button"
                onClick={() => toggleLike(photo.id)}
                className={cn(
                  "grid size-8 place-items-center rounded-full backdrop-blur active:scale-95 transition",
                  likes[photo.id]
                    ? "bg-red-700/90 text-white"
                    : "bg-black/40 text-white/85",
                )}
                aria-label="Like memory"
              >
                <IoHeart className="text-base" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </MainLayout>
  )
}
