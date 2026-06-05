import { Toaster } from './components/ui/sonner'
import AppRouter from './routes/AppRouter'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  )
}
