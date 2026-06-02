import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";


const StockManager = ({ products = [], onUpdateStock }) => {
  const [category, setCategory] = useState("");
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState(0);

  // =========================
  // categorías únicas
  // =========================
  const categories = [...new Set(products.map((p) => p.categoria))];

  // =========================
  // productos filtrados
  // =========================
  const filteredProducts = products.filter((p) => p.categoria === category);

  // =========================
  // producto seleccionado
  // =========================
  const selectedProduct = products.find((p) => p.id === Number(productId));

  // =========================
  // cuando cambia producto → set stock real
  // =========================
  useEffect(() => {
    if (selectedProduct) {
      setStock(selectedProduct.stock || 0);
    } else {
      setStock(0);
    }
  }, [selectedProduct]);

  // =========================
  // actualizar stock
  // =========================
  const handleUpdate = () => {
    if (!selectedProduct) return;

    onUpdateStock?.(selectedProduct.id, stock);

    alert("Stock actualizado correctamente");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h3 className="mb-4 text-center">Gestión de Stock</h3>

      {/* ================= CATEGORY ================= */}
      <Form.Group className="mb-3">
        <Form.Label>Categoría</Form.Label>

        <Form.Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setProductId("");
          }}
        >
          <option value="">Seleccionar categoría</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* ================= PRODUCT ================= */}
      <Form.Group className="mb-3">
        <Form.Label>Producto</Form.Label>

        <Form.Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          disabled={!category}
        >
          <option value="">Seleccionar producto</option>

          {filteredProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* ================= STOCK CONTROL ================= */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
        <Button
          variant="danger"
          onClick={() => setStock((s) => Math.max(0, s - 1))}
          disabled={!productId}
        >
          -
        </Button>

        <h2 className="m-0">{stock}</h2>

        <Button
          variant="success"
          onClick={() => setStock((s) => s + 1)}
          disabled={!productId}
        >
          +
        </Button>
      </div>

      {/* ================= UPDATE BUTTON ================= */}
      <Button
        variant="primary"
        className="w-100"
        onClick={handleUpdate}
        disabled={!productId}
      >
        Actualizar stock
      </Button>
    </div>
  );
};

export default StockManager;
