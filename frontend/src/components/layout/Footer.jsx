export default function Footer() {
  return (
    <footer className="border-t border-[#C9A227]/20 bg-[#0A1628] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="font-display text-xl text-[#C9A227]">Espiritu Libre</span>
            <p className="text-[#F4EFE4]/50 text-sm mt-1">
              Espirituosas exclusivas — Lista marzo 2026
            </p>
          </div>
          <div className="flex gap-6 text-sm text-[#F4EFE4]/40">
            <span>© 2026 Espiritu Libre</span>
            <span>TPI UTN</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
