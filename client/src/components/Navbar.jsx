import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Comprobar la preferencia de tema al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-indigo-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-indigo-900 dark:border-slate-800 text-white p-4 sticky top-0 z-50 transition-all duration-300">
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
        <nav>
          <ul className="flex space-x-6 text-sm font-semibold uppercase tracking-wider items-center">
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
            
            {/* Botón de Modo Oscuro */}
            <li>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-yellow-300 dark:text-blue-300"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  // Ícono de Luna
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  // Ícono de Sol
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </li>

            <li>
              <a href="/carrito" className="flex items-center gap-2 bg-white/10 hover:bg-violet-600 dark:hover:bg-slate-700 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-violet-500/40 dark:hover:shadow-slate-500/40">
                {/* Ícono de carrito SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Carrito</span>
                {/* Badge contador */}
                <span className="bg-violet-400 dark:bg-slate-600 text-indigo-950 dark:text-white text-xs font-black px-2 py-0.5 rounded-full ml-1">
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
