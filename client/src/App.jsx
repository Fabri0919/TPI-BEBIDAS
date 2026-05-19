import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error al obtener los productos: ", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">Espíritu Libre</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-amber-300">Inicio</a></li>
              <li><a href="#" className="hover:text-amber-300">Catálogo</a></li>
              <li><a href="#" className="hover:text-amber-300">Carrito</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Las Mejores Bebidas Espirituosas</h2>
          <p className="text-lg text-gray-600">Descubrí nuestra selección exclusiva para tus momentos especiales.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Imagen de {product.categoria}</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.nombre}</h3>
                <p className="text-amber-600 font-bold text-lg">${product.precio}</p>
                <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 p-6 text-center mt-auto">
        <p>&copy; 2026 Espíritu Libre - Bebidas Espirituosas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;