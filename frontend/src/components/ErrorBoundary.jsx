import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Render error caught:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#0D1E35] border border-[#C9A227]/30 rounded-2xl p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-danger text-3xl font-bold">!</span>
            </div>
            <h1 className="font-display text-2xl text-[#F4EFE4] font-bold mb-3">
              Algo salió mal
            </h1>
            <p className="text-[#F4EFE4]/50 text-sm mb-8 leading-relaxed">
              Ocurrió un error inesperado en la aplicación. Podés intentar recargar la página.
            </p>
            {this.state.error && (
              <p className="text-danger/60 text-xs font-mono mb-6 bg-danger/5 border border-danger/20 rounded-lg p-3 text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReload}
              className="bg-[#C9A227] text-[#0A1628] font-bold px-6 py-2.5 rounded-lg hover:bg-[#E0C56A] transition-colors text-sm"
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
