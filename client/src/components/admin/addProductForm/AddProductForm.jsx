import { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { categories } from "../../biz/harcodedData/data";

const AddProductForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen: "",
  });

  const alertRef = useRef(null);
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  // ---------------- ALERTA ----------------
  const showAlert = (msg) => {
    if (!alertRef.current) return;

    alertRef.current.innerText = msg;
    alertRef.current.style.display = "block";

    setTimeout(() => {
      if (alertRef.current) {
        alertRef.current.style.display = "none";
      }
    }, 2500);
  };

  // ---------------- VALIDACIÓN ----------------
  const validate = () => {
    if (!form.nombre.trim()) {
      showAlert("El nombre no puede estar vacío");
      return false;
    }

    if (!priceRegex.test(form.precio)) {
      showAlert("El precio debe tener hasta 2 decimales (ej: 12.99)");
      return false;
    }

    if (!form.categoria) {
      showAlert("Debe seleccionar una categoría");
      return false;
    }

    return true;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const newProduct = {
      id: Date.now(),
      nombre: form.nombre,
      precio: Number(form.precio),
      categoria: form.categoria,
      imagen: form.imagen || "Sin imagen",
    };

    alert("PRODUCTO CREADO:\n\n" + JSON.stringify(newProduct, null, 2));
    console.log("PRODUCTO ENVIADO AL BACK:", newProduct);

    setForm({
      nombre: "",
      precio: "",
      categoria: "",
      imagen: "",
    });
  };

  return (
    <div className="p-4 border rounded bg-light">
      <h3 className="mb-3">Agregar producto</h3>

      {/* ALERTA */}
      <div
        ref={alertRef}
        style={{
          display: "none",
          background: "#ffe5e5",
          color: "#a10000",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid red",
        }}
      />

      {/* FORM */}
      <Form onSubmit={handleSubmit}>
        {/* NOMBRE */}
        <Form.Control
          placeholder="Nombre"
          className="mb-2"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        {/* PRECIO */}
        <Form.Control
          placeholder="Precio (ej: 12.99)"
          className="mb-2"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
        />

        {/* CATEGORÍA */}
        <Form.Select
          className="mb-2"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </Form.Select>

        {/* DRAG & DROP IMAGEN */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];

            if (file) {
              setForm({ ...form, imagen: file.name });
            } else {
              setForm({
                ...form,
                imagen:
                  "https://tse1.mm.bing.net/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?pid=Api&P=0&h=180",
              });
            }
          }}
          className="p-3 border border-dashed rounded mb-3 text-center bg-white"
          style={{ cursor: "pointer" }}
        >
          {form.imagen ? (
            <strong>{form.imagen}</strong>
          ) : (
            "Arrastrar imagen aquí"
          )}
        </div>

        {/* BOTÓN */}
        <Button type="submit" className="w-100">
          Crear producto
        </Button>
      </Form>
    </div>
  );
};

export default AddProductForm;
