import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import { ProtectedRoute } from './ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'

// Public pages
import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import CatalogPage from '../pages/public/CatalogPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'

// Cliente pages
import CartPage from '../pages/cliente/CartPage'
import CheckoutPage from '../pages/cliente/CheckoutPage'
import OrderHistoryPage from '../pages/cliente/OrderHistoryPage'
import OrderDetailPage from '../pages/cliente/OrderDetailPage'

// Admin pages
import ProductsAdminPage from '../pages/admin/ProductsAdminPage'
import CategoriesAdminPage from '../pages/admin/CategoriesAdminPage'
import OrdersAdminPage from '../pages/admin/OrdersAdminPage'

// Super-admin pages
import UsersAdminPage from '../pages/super-admin/UsersAdminPage'

// Misc
import UnauthorizedPage from '../pages/UnauthorizedPage'
import NotFoundPage from '../pages/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      {/* All routes use AppLayout (header + footer) */}
      <Route element={<AppLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />

        {/* Cliente+ protected routes */}
        <Route
          path="/carrito"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'super-admin']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'super-admin']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'super-admin']}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/:id"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'super-admin']}>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/productos" replace />}
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
              <ProductsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
              <CategoriesAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
              <OrdersAdminPage />
            </ProtectedRoute>
          }
        />

        {/* Super-admin routes */}
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={['super-admin']}>
              <UsersAdminPage />
            </ProtectedRoute>
          }
        />

        {/* Misc */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
