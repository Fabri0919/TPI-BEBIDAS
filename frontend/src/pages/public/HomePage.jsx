import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from '@/components/catalog/ProductCard'
import * as productoService from '@/services/productoService'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productoService
      .list({ limit: 6, page: 1 })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items || []
        setFeatured(items.slice(0, 6))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#0A1628] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D1E35] via-[#0A1628] to-[#0A1628] py-24 px-4 text-center">
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C9A227]/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#C9A227]/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A227] mb-4"
          >
            Espirituosas exclusivas
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#F4EFE4] font-bold leading-tight"
          >
            Espiritu <span className="text-[#C9A227]">Libre</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-24 h-0.5 bg-[#C9A227] mx-auto my-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[#F4EFE4]/60 text-lg max-w-xl mx-auto"
          >
            Whiskys, Gins, Vodkas y más. Selección premium · Lista marzo 2026.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-bold px-10 text-base"
            >
              <Link to="/productos">
                Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl text-[#F4EFE4] font-bold">
              Productos destacados
            </h2>
            <div className="w-12 h-0.5 bg-[#C9A227] mt-2" />
          </div>
          <Link
            to="/productos"
            className="text-sm text-[#C9A227] hover:text-[#E0C56A] flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton className="h-48 bg-[#16161D]" />
                <div className="bg-[#0D1E35] p-4 space-y-2">
                  <Skeleton className="h-4 bg-[#16161D] w-3/4" />
                  <Skeleton className="h-6 bg-[#16161D] w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p className="text-[#F4EFE4]/40 text-center py-12">
            El catálogo estará disponible pronto.
          </p>
        )}
      </section>
    </div>
  );
}
