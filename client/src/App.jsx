import React, { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error al obtener los productos: ", err));
  }, []);

  return (
    <MainLayout>
      <section className="text-center mb-12 mt-8 transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-indigo-950 dark:text-indigo-100 mb-4 transition-colors duration-300">Las Mejores Bebidas Espirituosas</h2>
        <p className="text-lg text-indigo-900/70 dark:text-indigo-200/70 transition-colors duration-300">Descubrí nuestra selección exclusiva para tus momentos especiales.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-indigo-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-900/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-indigo-50 dark:bg-slate-900 flex items-center justify-center border-b border-indigo-100 dark:border-slate-700 transition-colors duration-300">
              <span className="text-indigo-300 dark:text-slate-500 font-medium">Imagen de {product.categoria}</span>
            </div>
            <div className="p-5 transition-colors duration-300">
              <h3 className="text-xl font-bold text-indigo-950 dark:text-white mb-2">{product.nombre}</h3>
              <p className="text-violet-600 dark:text-violet-400 font-black text-xl mb-4">${product.precio}</p>
              <button className="w-full bg-indigo-900 dark:bg-violet-700 text-white font-semibold py-2.5 rounded-md hover:bg-violet-600 dark:hover:bg-violet-600 transition-colors duration-300 shadow-md shadow-indigo-900/20 dark:shadow-none">
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </section>
    </MainLayout>
  );
}

export default App;