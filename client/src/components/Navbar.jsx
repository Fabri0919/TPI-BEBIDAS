import React from 'react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  return (
    <header className="bg-indigo-950/85 backdrop-blur-md border-b border-indigo-900 text-white p-4 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo interactivo */}
        <div className="flex items-center group cursor-pointer">
          <img 
            src={logoImg} 
            alt="Logo Espíritu Libre" 
            className="w-12 h-12 rounded-full object-cover mr-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-violet-500/30 border-2 border-indigo-400/30"
          />
          <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 group-hover:from-violet-300 group-hover:to-fuchsia-400 transition-all duration-300">
            Espíritu Libre
          </h1>
        </div>

        {/* Enlaces y Carrito */}
        <nav>
          <ul className="flex space-x-8 text-sm font-semibold uppercase tracking-wider items-center">
            <li>
              <a href="/" className="relative group py-2">
                <span className="group-hover:text-violet-400 transition-colors duration-300">Inicio</span>
                {/* Línea animada inferior */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </li>
            <li>
              <a href="/productos" className="relative group py-2">
                <span className="group-hover:text-violet-400 transition-colors duration-300">Catálogo</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </li>
            <li>
              <a href="/carrito" className="flex items-center gap-2 bg-white/10 hover:bg-violet-600 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-violet-500/40">
                {/* Ícono de carrito SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Carrito</span>
                {/* Badge contador */}
                <span className="bg-violet-400 text-indigo-950 text-xs font-black px-2 py-0.5 rounded-full ml-1">
                  0
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
