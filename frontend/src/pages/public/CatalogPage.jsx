import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/catalog/ProductCard'
import { useDebounce } from '@/hooks/useDebounce'
import * as productoService from '@/services/productoService'
import * as categoriaService from '@/services/categoriaService'

const PAGE_SIZE = 24

export default function CatalogPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedSub, setSelectedSub] = useState(null)
  const [search, setSearch] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [showOutOfStock, setShowOutOfStock] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)
  const debouncedMin = useDebounce(priceMin, 400)
  const debouncedMax = useDebounce(priceMax, 400)

  // Selected category object
  const selectedCatObj = categorias.find((c) => c.id === selectedCat)
  const isWhisky = selectedCatObj?.nombre?.toLowerCase() === 'whisky'

  const SUBCATEGORIAS = ['Blend', 'Single Malt', 'American', 'Irish']

  // Fetch categories once
  useEffect(() => {
    categoriaService
      .listAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.categorias || []
        setCategorias(list.filter((c) => c.activo !== false))
      })
      .catch(() => {})
  }, [])

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        includeOutOfStock: showOutOfStock,
      }
      if (selectedCat) params.categoriaId = selectedCat
      if (selectedSub) params.subcategoria = selectedSub
      if (debouncedSearch) params.search = debouncedSearch
      if (debouncedMin) params.priceMin = parseInt(debouncedMin, 10) * 100
      if (debouncedMax) params.priceMax = parseInt(debouncedMax, 10) * 100

      const data = await productoService.list(params)
      setProductos(Array.isArray(data) ? data : data.items || [])
      setTotal(data.total || (Array.isArray(data) ? data.length : 0))
    } catch {
      setProductos([])
    } finally {
      setLoading(false)
    }
  }, [page, selectedCat, selectedSub, debouncedSearch, debouncedMin, debouncedMax, showOutOfStock])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [selectedCat, selectedSub, debouncedSearch, debouncedMin, debouncedMax, showOutOfStock])

  function selectCategory(id) {
    setSelectedCat((prev) => (prev === id ? null : id))
    setSelectedSub(null)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">
          Categorías
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => selectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCat === null
                  ? 'bg-[#C9A227]/20 text-[#C9A227] font-semibold'
                  : 'text-[#F4EFE4]/70 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
              }`}
            >
              Todas
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => selectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-[#C9A227]/20 text-[#C9A227] font-semibold'
                    : 'text-[#F4EFE4]/70 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
                }`}
              >
                {cat.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Whisky subcategory filter */}
      {isWhisky && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">
            Tipo de whisky
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setSelectedSub(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSub === null
                    ? 'bg-[#C9A227]/20 text-[#C9A227] font-semibold'
                    : 'text-[#F4EFE4]/70 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
                }`}
              >
                Todos
              </button>
            </li>
            {SUBCATEGORIAS.map((s) => (
              <li key={s}>
                <button
                  onClick={() => setSelectedSub((prev) => (prev === s ? null : s))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedSub === s
                      ? 'bg-[#C9A227]/20 text-[#C9A227] font-semibold'
                      : 'text-[#F4EFE4]/70 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">
          Buscar
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F4EFE4]/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre del producto..."
            className="pl-9 bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 focus:border-[#C9A227] text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4EFE4]/30 hover:text-[#F4EFE4]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">
          Precio (ARS)
        </h3>
        <div className="flex gap-2">
          <Input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Mín"
            className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 text-sm"
          />
          <Input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Máx"
            className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4] placeholder:text-[#F4EFE4]/30 text-sm"
          />
        </div>
      </div>

      {/* Ver agotados */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#F4EFE4]/70">Ver agotados</span>
        <Switch
          checked={showOutOfStock}
          onCheckedChange={setShowOutOfStock}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0D1E35] to-[#0A1628] py-12 px-4 text-center border-b border-[#C9A227]/10">
        <h1 className="font-display text-4xl sm:text-5xl text-[#F4EFE4] font-bold uppercase tracking-wide">
          Espirituosas{' '}
          <span className="text-[#C9A227]">Exclusivas</span>
        </h1>
        <div className="w-24 h-0.5 bg-[#C9A227] mx-auto mt-4" />
        <p className="text-[#F4EFE4]/50 mt-4 text-sm">
          Selección premium · Lista marzo 2026
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="sticky top-24 bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl p-5">
              {sidebar}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen((v) => !v)}
                className="border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/10"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              {sidebarOpen && (
                <div className="mt-3 bg-[#0D1E35] border border-[#C9A227]/20 rounded-xl p-5">
                  {sidebar}
                </div>
              )}
            </div>

            {/* Active filters */}
            {(selectedCat || selectedSub || search || priceMin || priceMax) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCatObj && (
                  <Badge
                    onClick={() => { setSelectedCat(null); setSelectedSub(null) }}
                    className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30 cursor-pointer hover:bg-[#C9A227]/30 text-xs"
                  >
                    {selectedCatObj.nombre} ×
                  </Badge>
                )}
                {selectedSub && (
                  <Badge
                    onClick={() => setSelectedSub(null)}
                    className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30 cursor-pointer hover:bg-[#C9A227]/30 text-xs"
                  >
                    {selectedSub} ×
                  </Badge>
                )}
                {search && (
                  <Badge
                    onClick={() => setSearch('')}
                    className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30 cursor-pointer hover:bg-[#C9A227]/30 text-xs"
                  >
                    &quot;{search}&quot; ×
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            {!loading && (
              <p className="text-[#F4EFE4]/40 text-sm mb-4">
                {total} producto{total !== 1 ? 's' : ''}
              </p>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="h-48 bg-[#16161D]" />
                    <div className="bg-[#0D1E35] p-4 space-y-2">
                      <Skeleton className="h-4 bg-[#16161D] w-3/4" />
                      <Skeleton className="h-4 bg-[#16161D] w-1/2" />
                      <Skeleton className="h-8 bg-[#16161D] w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-[#F4EFE4]/40 text-lg">
                  No encontramos productos con esos filtros.
                </p>
                <Button
                  variant="ghost"
                  className="mt-4 text-[#C9A227] hover:bg-[#C9A227]/10"
                  onClick={() => {
                    setSelectedCat(null)
                    setSelectedSub(null)
                    setSearch('')
                    setPriceMin('')
                    setPriceMax('')
                    setShowOutOfStock(false)
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productos.map((p) => (
                    <ProductCard key={p.id} producto={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/10 disabled:opacity-30"
                    >
                      Anterior
                    </Button>
                    <span className="text-[#F4EFE4]/50 text-sm px-4">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/10 disabled:opacity-30"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
