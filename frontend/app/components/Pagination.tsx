'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center gap-2 mt-12 mb-8 font-headline"
    >
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center justify-center w-10 h-10 rounded border border-surface-variant hover:bg-surface-container-low transition-colors text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <div className="flex gap-1">
        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`flex items-center justify-center w-10 h-10 rounded text-sm transition-all cursor-pointer ${
                p === page
                  ? 'bg-primary-container text-white font-bold shadow-sm'
                  : 'hover:bg-surface-container-low text-on-surface-variant'
              }`}
            >
              {p}
            </button>
          ) : (
            <span
              key={idx}
              className="flex items-center justify-center w-10 h-10 text-on-surface-variant/50"
            >
              ...
            </span>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded border border-surface-variant hover:bg-surface-container-low transition-colors text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  )
}
