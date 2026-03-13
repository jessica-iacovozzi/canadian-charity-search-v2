'use client'

import { useState, useEffect } from 'react'
import { Search, Star, MapPin, Building2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

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

interface ApiResponse {
  total: number
  page: number
  page_size: number
  charities: Charity[]
}

export default function Home() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [province, setProvince] = useState('')
  const [minRating, setMinRating] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sectors, setSectors] = useState<string[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const PAGE_SIZE = 20

  useEffect(() => {
    fetchSectors()
    fetchProvinces()
  }, [search, sector, province, minRating])

  useEffect(() => {
    fetchCharities()
  }, [page, search, sector, province, minRating, sortBy, sortOrder])

  const fetchSectors = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (province) params.append('province', province)
      if (minRating) params.append('min_rating', minRating)
      
      const response = await fetch(`${API_URL}/sectors?${params}`)
      const data = await response.json()
      setSectors(data.sectors || [])
    } catch (error) {
      console.error('Error fetching sectors:', error)
    }
  }

  const fetchProvinces = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (sector) params.append('sector', sector)
      if (minRating) params.append('min_rating', minRating)
      
      const response = await fetch(`${API_URL}/provinces?${params}`)
      const data = await response.json()
      setProvinces(data.provinces || [])
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchCharities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: PAGE_SIZE.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      if (search) params.append('search', search)
      if (sector) params.append('sector', sector)
      if (province) params.append('province', province)
      if (minRating) params.append('min_rating', minRating)

      const response = await fetch(`${API_URL}/charities?${params}`)
      const data: ApiResponse = await response.json()
      
      setCharities(data.charities)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching charities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchCharities()
  }

  const handleReset = () => {
    setSearch('')
    setSector('')
    setProvince('')
    setMinRating('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Canadian Charity Search
          </h1>
          <p className="text-xl text-gray-600">
            Discover and explore Canadian charities with detailed information
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or slogan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Provinces</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="star_rating">Sort by Rating</option>
                <option value="city">Sort by City</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>

            <div className="ml-auto text-gray-600 font-medium">
              {total} charities found
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading charities...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {charity.name}
                    </h3>
                    {charity.star_rating && (
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="font-semibold text-gray-800">
                          {charity.star_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {charity.slogan && (
                    <p className="text-gray-600 italic mb-4">{charity.slogan}</p>
                  )}

                  <div className="space-y-2 mb-4 flex-grow">
                    {charity.sector && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} className="text-blue-600" />
                        <span className="text-sm">{charity.sector}</span>
                      </div>
                    )}

                    {(charity.city || charity.province) && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-red-600" />
                        <span className="text-sm">
                          {[charity.city, charity.province].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {charity.registration_number && (
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Reg #:</span> {charity.registration_number}
                      </div>
                    )}
                  </div>

                  <a
                    href={charity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mt-auto"
                  >
                    View Details
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
