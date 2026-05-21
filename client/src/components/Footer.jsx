import React from 'react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-indigo-200 pt-12 pb-6 relative overflow-hidden">
      {/* Línea de degradado superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Columna 1: Marca */}
        <div>
          <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <img src={logoImg} alt="Logo Espíritu Libre" className="w-8 h-8 rounded-full object-cover shadow-md border border-indigo-400/30" />
            Espíritu Libre
          </h3>
          <p className="text-sm leading-relaxed text-indigo-200/80">
            Elevando tus momentos especiales con la selección más exclusiva de bebidas espirituosas. Pasión y calidad en cada botella.
          </p>
        </div>
        
        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-violet-400 hover:translate-x-1 inline-block transition-transform duration-300">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 hover:translate-x-1 inline-block transition-transform duration-300">
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 hover:translate-x-1 inline-block transition-transform duration-300">
                Política de Privacidad
              </a>
            </li>
          </ul>
        </div>
        
        {/* Columna 3: Contacto */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-violet-400">📍</span> Rosario, Argentina
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">✉️</span> info@espiritulibre.com
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">📞</span> +54 11 1234-5678
            </li>
          </ul>
        </div>

      </div>
      
      {/* Derechos de Autor */}
      <div className="container mx-auto px-4 text-center text-xs border-t border-indigo-900/50 pt-6 text-indigo-300/60">
        <p>&copy; {new Date().getFullYear()} Espíritu Libre. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
