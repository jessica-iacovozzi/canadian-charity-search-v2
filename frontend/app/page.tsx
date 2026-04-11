'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

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
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sectors, setSectors] = useState<string[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('name_asc')
  const [openSection, setOpenSection] = useState<string | null>('sectors')
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const PAGE_SIZE = 18

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchSectors = async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        selectedProvinces.forEach((p) => params.append('province', p))
        if (minRating) params.append('min_rating', minRating.toString())
        
        const response = await fetch(`${API_URL}/sectors?${params}`, {
          signal: controller.signal
        })
        if (!response.ok) throw new Error('Failed to fetch sectors')
        const data = await response.json()
        setSectors(data.sectors || [])
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('Error fetching sectors:', err)
      }
    }
    fetchSectors()
    
    return () => controller.abort()
  }, [API_URL, search, selectedProvinces, minRating])

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchProvinces = async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        selectedSectors.forEach((s) => params.append('sector', s))
        if (minRating) params.append('min_rating', minRating.toString())
        
        const response = await fetch(`${API_URL}/provinces?${params}`, {
          signal: controller.signal
        })
        if (!response.ok) throw new Error('Failed to fetch provinces')
        const data = await response.json()
        setProvinces(data.provinces || [])
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('Error fetching provinces:', err)
      }
    }
    fetchProvinces()
    
    return () => controller.abort()
  }, [API_URL, search, selectedSectors, minRating])

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchCharities = async () => {
      setLoading(true)
      setError(null)
      try {
        const lastUnderscoreIndex = sortBy.lastIndexOf('_')
        if (lastUnderscoreIndex === -1) {
          console.error('Invalid sortBy format:', sortBy)
          setSortBy('name_asc')
          return
        }
        const sortField = sortBy.substring(0, lastUnderscoreIndex)
        const sortOrder = sortBy.substring(lastUnderscoreIndex + 1)
        
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: PAGE_SIZE.toString(),
          sort_by: sortField,
          sort_order: sortOrder,
        })

        if (search) params.append('search', search)
        selectedSectors.forEach((s) => params.append('sector', s))
        selectedProvinces.forEach((p) => params.append('province', p))
        if (minRating) params.append('min_rating', minRating.toString())

        const response = await fetch(`${API_URL}/charities?${params}`, {
          signal: controller.signal
        })
        if (!response.ok) throw new Error('Failed to fetch charities')
        const data: ApiResponse = await response.json()
        
        setCharities(data.charities)
        setTotal(data.total)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('Error fetching charities:', err)
        setError('Failed to load charities. Please try again.')
        setCharities([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchCharities()
    
    return () => controller.abort()
  }, [API_URL, page, search, selectedSectors, selectedProvinces, minRating, sortBy])

  const handleSectorToggle = useCallback((sectorName: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorName)
        ? prev.filter((s) => s !== sectorName)
        : [...prev, sectorName]
    )
    setPage(1)
  }, [setPage])

  const handleProvinceToggle = useCallback((provinceName: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(provinceName)
        ? prev.filter((p) => p !== provinceName)
        : [...prev, provinceName]
    )
    setPage(1)
  }, [setPage])

  const handleRatingClick = useCallback((clickedRating: number) => {
    setMinRating((prev) => clickedRating === prev ? 0 : clickedRating)
    setPage(1)
  }, [setPage])

  const toggleSection = useCallback((section: string) => {
    setOpenSection((prev) => prev === section ? null : section)
  }, [])

  const handleReset = useCallback(() => {
    setSearch('')
    setSelectedSectors([])
    setSelectedProvinces([])
    setMinRating(0)
    setSortBy('name_asc')
    setPage(1)
  }, [])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="cursor-default">
      <Navbar
        search={search}
        setSearch={setSearch}
        onSearchSubmit={() => setPage(1)}
      />

      <div className="flex min-h-screen">
        <Sidebar
          sectors={sectors}
          provinces={provinces}
          selectedSectors={selectedSectors}
          selectedProvinces={selectedProvinces}
          minRating={minRating}
          sortBy={sortBy}
          openSection={openSection}
          onSectorToggle={handleSectorToggle}
          onProvinceToggle={handleProvinceToggle}
          onRatingClick={handleRatingClick}
          onSortChange={setSortBy}
          onToggleSection={toggleSection}
          onReset={handleReset}
          search={search}
          setSearch={setSearch}
          onSearchSubmit={() => setPage(1)}
        />

        <MainContent
          charities={charities}
          total={total}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
