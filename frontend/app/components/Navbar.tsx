'use client'

interface NavbarProps {
  search: string
  setSearch: (value: string) => void
  onSearchSubmit: () => void
}

export default function Navbar({ search, setSearch, onSearchSubmit }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm dark:shadow-none font-headline antialiased">
      <div className="flex items-center justify-between px-8 h-16 max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-red-900 dark:text-red-500">
            Canadian Charity Archive
          </span>
        </div>
        {/* Search bar - hidden on mobile/tablet, visible on desktop */}
        <div className="hidden lg:block flex-1 px-8 mx-auto max-w-2xl">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
              search
            </span>
            <input
              className="w-full bg-surface-container-highest border-none outline-none focus:ring-2 focus:ring-primary/20 rounded-lg py-2 pl-10 pr-4 text-sm transition-all placeholder:text-on-surface-variant/40 cursor-text"
              placeholder="Search by name or slogan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
