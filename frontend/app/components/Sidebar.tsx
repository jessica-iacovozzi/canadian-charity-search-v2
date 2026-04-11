'use client'

import { useState, useCallback } from 'react'

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
  search?: string
  setSearch?: (value: string) => void
  onSearchSubmit?: () => void
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
  search,
  setSearch,
  onSearchSubmit,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const activeFiltersCount = selectedSectors.length + selectedProvinces.length + (minRating > 0 ? 1 : 0)

  const handleOverlayClick = useCallback(() => {
    setIsCollapsed(true)
  }, [])

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-20 left-4 z-40 flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg shadow-lg"
        aria-label="Toggle filters"
        aria-expanded={!isCollapsed}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isCollapsed ? 'filter_list' : 'close'}
        </span>
        <span className="text-sm font-bold">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-red-900 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed left-0 bg-stone-50 dark:bg-stone-950 flex flex-col p-6 gap-y-4 font-body text-sm tracking-wide transition-all duration-300 overflow-y-auto z-40
          
          /* Mobile: full width, slides from top */
          top-16 w-full pb-6 max-h-[90vh]
          ${isCollapsed ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
          
          /* Desktop: fixed sidebar */
          lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto
          lg:w-[350px] lg:h-screen lg:max-h-none lg:pb-24
        `}
      >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-red-900 dark:text-red-500 font-bold uppercase tracking-widest text-xs">
            Filters
          </h2>
          <p className="text-stone-500 text-xs mt-1">Refine your search</p>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="lg:hidden p-2 aspect-square w-100 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors"
          aria-label="Close filters"
        >
          <span className="material-symbols-outlined text-stone-500">close</span>
        </button>
      </div>

      {/* Search bar - visible only on mobile/tablet */}
      {setSearch && (
        <div className="lg:hidden mb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
              search
            </span>
            <input
              className="w-full bg-surface-container-highest border-none outline-none focus:ring-2 focus:ring-primary/20 rounded-lg py-2 pl-10 pr-4 text-sm transition-all placeholder:text-on-surface-variant/40 cursor-text"
              placeholder="Search by name or slogan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchSubmit?.()
                  setIsCollapsed(true)
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Sector Multi-select */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('sectors')}
          className="flex items-center justify-between w-full text-stone-500 hover:text-red-800 p-2 cursor-pointer"
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
                  type="button"
                  onClick={() => onRatingClick(i)}
                  aria-label={`Filter by ${i} or more stars`}
                  aria-pressed={i <= minRating}
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
        onClick={() => {
          onReset()
          setIsCollapsed(true)
        }}
        className="mt-8 text-xs font-bold uppercase tracking-widest text-red-900 dark:text-red-500 underline hover:no-underline transition-all text-left px-2 cursor-pointer"
      >
        Reset All Filters
      </button>

      {/* Apply Filters button - mobile only */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="lg:hidden mt-4 w-full bg-red-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-red-800 transition-colors"
      >
        Apply Filters
      </button>
    </aside>
    </>
  )
}
