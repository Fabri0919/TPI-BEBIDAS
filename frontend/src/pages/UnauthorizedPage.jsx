import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-display">Acceso denegado</h1>
      <p className="text-muted-foreground">No tenés permiso para acceder a esta sección.</p>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-accent text-primary rounded"
          onClick={() => navigate('/')}
        >
          Ir al inicio
        </button>
        <button
          className="px-4 py-2 border border-border rounded"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  )
}
