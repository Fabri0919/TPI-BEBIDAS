import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <p className="font-display text-[8rem] leading-none text-[#C9A227]/20 font-bold select-none mb-2">
          404
        </p>
        <h1 className="font-display text-3xl text-[#F4EFE4] font-bold mb-3">
          Página no encontrada
        </h1>
        <p className="text-[#F4EFE4]/50 text-sm mb-10 leading-relaxed">
          La página que estás buscando no existe o fue movida.
        </p>
        <Link
          to="/productos"
          className="inline-block bg-[#C9A227] text-[#0A1628] font-bold px-8 py-3 rounded-lg hover:bg-[#E0C56A] transition-colors text-sm"
        >
          Volver al catálogo
        </Link>
      </motion.div>
    </div>
  )
}
