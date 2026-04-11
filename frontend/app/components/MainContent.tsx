'use client'

import Pagination from './Pagination'
import Footer from './Footer'

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

interface Charity {
  id: number
  name: string
  link: string
  star_rating: number | null
  slogan: string | null
  sector: string | null
  city: string | null
  province: string | null
  registration_number: string | null
}

interface MainContentProps {
  charities: Charity[]
  total: number
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return null
  const filled = Math.round(rating)
  return (
    <div className="flex text-primary gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: i <= filled ? "'FILL' 1" : "'FILL' 0" }}
        >
          grade
        </span>
      ))}
    </div>
  )
}

export default function MainContent({
  charities,
  total,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: MainContentProps) {
  return (
    <main className="flex-1 p-6 pt-20 md:p-8 md:pt-24 lg:ml-[350px] lg:p-12 lg:pt-12 bg-surface">
      <header className="mb-8 lg:mb-12">
        <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary mb-4">
          Discover Charities
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl leading-relaxed">
          Access verified financial data and impact metrics for registered Canadian non-profits.
          Our archive provides transparency to help you make informed philanthropic decisions.
        </p>
        <p className="font-body text-on-surface-variant mt-2">
          <span className="font-semibold">{total}</span> charities found
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-4">error</span>
          <p className="font-body text-on-surface-variant">{error}</p>
        </div>
      ) : charities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">search_off</span>
          <p className="font-body text-on-surface-variant">No charities found matching your criteria.</p>
          <p className="font-body text-on-surface-variant text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {charities.map((charity) => (
              <article
                key={charity.id}
                className="bg-surface-container-lowest p-6 rounded transition-all hover:bg-white hover:shadow-2xl hover:shadow-on-surface/5 group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  {charity.sector && (
                    <span className="label-md text-[10px] uppercase tracking-widest font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">
                      {charity.sector}
                    </span>
                  )}
                  <StarRating rating={charity.star_rating} />
                </div>
                <h3 className="font-headline text-lg font-bold text-primary mb-1">
                  {charity.name}
                </h3>
                {charity.slogan && (
                  <p className="font-body italic text-on-surface-variant text-sm mb-4">
                    {charity.slogan}
                  </p>
                )}
                <div className="space-y-4 mb-6 flex-grow">
                  {(charity.city || charity.province) && (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>
                        {[charity.city, charity.province].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container-low">
                  {charity.registration_number && (
                    <span className="font-mono text-[10px] text-stone-400">
                      BN: {charity.registration_number}
                    </span>
                  )}
                  {isValidUrl(charity.link) ? (
                    <a
                      href={charity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline transition-all cursor-pointer"
                    >
                      View Details
                    </a>
                  ) : (
                    <span className="text-xs text-stone-400">Invalid link</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />

          <Footer />
        </>
      )}
    </main>
  )
}
