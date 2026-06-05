import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Header() {
  const { user, isAuthenticated, hasRole, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user
    ? user.nombre
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : ''

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#C9A227]/20 bg-[#0A1628]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-display text-xl font-bold text-[#C9A227] hover:text-[#E0C56A] transition-colors"
            >
              Espiritu Libre
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/productos"
                className="text-[#F4EFE4]/80 hover:text-[#C9A227] transition-colors text-sm font-medium"
              >
                Catálogo
              </Link>

              {isAuthenticated && hasRole('cliente', 'admin', 'super-admin') && (
                <Link
                  to="/pedidos"
                  className="text-[#F4EFE4]/80 hover:text-[#C9A227] transition-colors text-sm font-medium"
                >
                  Mis pedidos
                </Link>
              )}

              {isAuthenticated && hasRole('admin', 'super-admin') && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-[#F4EFE4]/80 hover:text-[#C9A227] transition-colors text-sm font-medium">
                      Admin <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate('/admin/productos')}
                      className="hover:bg-[#C9A227]/10 cursor-pointer"
                    >
                      Productos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/admin/categorias')}
                      className="hover:bg-[#C9A227]/10 cursor-pointer"
                    >
                      Categorías
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/admin/pedidos')}
                      className="hover:bg-[#C9A227]/10 cursor-pointer"
                    >
                      Pedidos
                    </DropdownMenuItem>
                    {hasRole('super-admin') && (
                      <>
                        <DropdownMenuSeparator className="bg-[#C9A227]/20" />
                        <DropdownMenuItem
                          onClick={() => navigate('/admin/usuarios')}
                          className="hover:bg-[#C9A227]/10 cursor-pointer"
                        >
                          Usuarios
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Cart icon — visible to authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 text-[#F4EFE4]/70 hover:text-[#C9A227] transition-colors"
                  aria-label="Abrir carrito"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[#0A1628] text-xs font-bold">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
              )}

              {/* Auth area */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full bg-[#C9A227]/20 px-3 py-1.5 text-sm font-medium text-[#C9A227] hover:bg-[#C9A227]/30 transition-colors">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A227] text-[#0A1628] text-xs font-bold">
                        {initials}
                      </span>
                      <span className="hidden sm:block max-w-[120px] truncate">
                        {user.nombre}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#16161D] border-[#C9A227]/30 text-[#F4EFE4]"
                  >
                    <div className="px-2 py-1.5 text-xs text-[#F4EFE4]/50">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator className="bg-[#C9A227]/20" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="hover:bg-[#C9A227]/10 cursor-pointer text-danger"
                    >
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-[#F4EFE4]/80 hover:text-[#C9A227] hover:bg-transparent"
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/registro')}
                    className="bg-[#C9A227] text-[#0A1628] hover:bg-[#E0C56A] font-semibold"
                  >
                    Registrarse
                  </Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-[#F4EFE4]/70 hover:text-[#C9A227]"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menú"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[#C9A227]/20 py-4 space-y-3">
              <Link
                to="/productos"
                className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1"
                onClick={() => setMobileOpen(false)}
              >
                Catálogo
              </Link>
              {isAuthenticated && (
                <Link
                  to="/pedidos"
                  className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  Mis pedidos
                </Link>
              )}
              {isAuthenticated && hasRole('admin', 'super-admin') && (
                <>
                  <Link
                    to="/admin/productos"
                    className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1 pl-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin › Productos
                  </Link>
                  <Link
                    to="/admin/categorias"
                    className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1 pl-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin › Categorías
                  </Link>
                  <Link
                    to="/admin/pedidos"
                    className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1 pl-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin › Pedidos
                  </Link>
                </>
              )}
              {isAuthenticated && hasRole('super-admin') && (
                <Link
                  to="/admin/usuarios"
                  className="block text-[#F4EFE4]/80 hover:text-[#C9A227] text-sm font-medium py-1 pl-3"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin › Usuarios
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* CartDrawer rendered from Header to manage open state */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
