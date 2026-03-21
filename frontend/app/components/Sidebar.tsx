'use client'

interface SidebarProps {
  sectors: string[]
  provinces: string[]
  selectedSectors: string[]
  selectedProvinces: string[]
  minRating: number
  sortBy: string
  openSection: string | null
  onSectorToggle: (sector: string) => void
  onProvinceToggle: (province: string) => void
  onRatingClick: (rating: number) => void
  onSortChange: (value: string) => void
  onToggleSection: (section: string) => void
  onReset: () => void
}

export default function Sidebar({
  sectors,
  provinces,
  selectedSectors,
  selectedProvinces,
  minRating,
  sortBy,
  openSection,
  onSectorToggle,
  onProvinceToggle,
  onRatingClick,
  onSortChange,
  onToggleSection,
  onReset,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-screen w-[350px] bg-stone-50 dark:bg-stone-950 flex flex-col p-6 gap-y-4 font-body text-sm tracking-wide transition-transform duration-300 overflow-y-auto pb-24">
      <div className="mb-2">
        <h2 className="text-red-900 dark:text-red-500 font-bold uppercase tracking-widest text-xs">
          Filters
        </h2>
        <p className="text-stone-500 text-xs mt-1">Refine your search</p>
      </div>

      {/* Sector Multi-select */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('sectors')}
          className="flex items-center justify-between w-full text-red-900 dark:text-red-400 font-bold bg-stone-100 dark:bg-stone-900 p-2 rounded cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">category</span>
            <span>All Sectors</span>
          </div>
          <span className="material-symbols-outlined text-[20px] transition-transform" style={{ transform: openSection === 'sectors' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </button>
        {openSection === 'sectors' && (
          <div className="pl-2 space-y-2">
            {sectors.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 text-stone-500 hover:text-red-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(s)}
                  onChange={() => onSectorToggle(s)}
                  className="rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Provinces Multi-select */}
      <div className="space-y-3 mt-4">
        <button
          onClick={() => onToggleSection('provinces')}
          className="flex items-center justify-between w-full text-stone-500 hover:text-red-800 p-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">map</span>
            <span>Provinces</span>
          </div>
          <span className="material-symbols-outlined text-[20px] transition-transform" style={{ transform: openSection === 'provinces' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </button>
        {openSection === 'provinces' && (
          <div className="pl-2 space-y-2">
            {provinces.map((p) => (
              <label
                key={p}
                className="flex items-center gap-2 text-stone-500 hover:text-red-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProvinces.includes(p)}
                  onChange={() => onProvinceToggle(p)}
                  className="rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Star Rating */}
      <div className="space-y-3 mt-4">
        <button
          onClick={() => onToggleSection('rating')}
          className="flex items-center justify-between w-full text-stone-500 hover:text-red-800 p-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">grade</span>
            <span>Star Rating</span>
          </div>
          <span className="material-symbols-outlined text-[20px] transition-transform" style={{ transform: openSection === 'rating' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </button>
        {openSection === 'rating' && (
          <div className="pl-2 flex flex-col gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => onRatingClick(i)}
                  aria-label={`Filter by ${i} or more stars`}
                  className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: i <= minRating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  grade
                </button>
              ))}
            </div>
            {minRating > 0 && (
              <span className="text-xs text-stone-500">{minRating}+ stars</span>
            )}
          </div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="space-y-3 mt-4">
        <button
          onClick={() => onToggleSection('sort')}
          className="flex items-center justify-between w-full text-stone-500 hover:text-red-800 p-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">sort</span>
            <span>Sort Results</span>
          </div>
          <span className="material-symbols-outlined text-[20px] transition-transform" style={{ transform: openSection === 'sort' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </button>
        {openSection === 'sort' && (
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-surface-container-low border-none text-xs rounded-lg py-2 focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="star_rating_desc">Rating (High-Low)</option>
            <option value="star_rating_asc">Rating (Low-High)</option>
            <option value="city_asc">City (A-Z)</option>
            <option value="city_desc">City (Z-A)</option>
          </select>
        )}
      </div>

      <button
        onClick={onReset}
        className="mt-8 text-xs font-bold uppercase tracking-widest text-red-900 dark:text-red-500 underline hover:no-underline transition-all text-left px-2 cursor-pointer"
      >
        Reset All Filters
      </button>
    </aside>
  )
}
