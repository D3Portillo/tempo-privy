import { Footer } from "@/components/Footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-3xl font-bold text-white">WeBond</h1>
        <button className="relative w-10 h-10 bg-wb-violet/20 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-wb-violet rounded-full" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-wb-red rounded-full text-sm flex items-center justify-center text-white font-bold">
            1
          </span>
        </button>
      </header>

      {/* Page Content */}
      <main className="px-6">{children}</main>

      <Footer />
    </div>
  )
}
