import { useEffect, useState } from "react";
import { Badge, Button, Container, Form, Modal, Navbar, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import { ordersApi, productsApi, usersApi } from "../services/api";

const emptyProduct = { name: "", price: "", category: "", stock: "", image: "" };
const emptyUser = { name: "", email: "", password: "", role: "user", active: true };

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setProducts(await productsApi.list());
    setOrders(await ordersApi.list());
    if (user.role === "super-admin") setUsers(await usersApi.list());
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.message));
  }, []);

  const validateProduct = () => {
    if (!productForm.name.trim()) return "El producto necesita nombre.";
    if (!productForm.category.trim()) return "El producto necesita categoria.";
    if (Number(productForm.price) <= 0) return "El precio debe ser mayor a cero.";
    if (Number(productForm.stock) < 0) return "El stock no puede ser negativo.";
    return "";
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const validationError = validateProduct();
    if (validationError) return setError(validationError);

    const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
    if (editingProduct) await productsApi.update(editingProduct.id, payload);
    else await productsApi.create(payload);

    setProductForm(emptyProduct);
    setEditingProduct(null);
    setError("");
    loadData();
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
  };

  const removeProduct = async (id) => {
    await productsApi.remove(id);
    loadData();
  };

  const validateUser = () => {
    if (!userForm.name.trim()) return "El usuario necesita nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) return "Ingrese un email valido.";
    if (!editingUser && userForm.password.length < 8) return "La contrasena debe tener al menos 8 caracteres.";
    return "";
  };

  const saveUser = async (event) => {
    event.preventDefault();
    const validationError = validateUser();
    if (validationError) return setError(validationError);

    if (editingUser) await usersApi.update(editingUser.id, userForm);
    else await usersApi.create(userForm);

    setUserForm(emptyUser);
    setEditingUser(null);
    setError("");
    loadData();
  };

  const editUser = (currentUser) => {
    setEditingUser(currentUser);
    setUserForm({ ...currentUser, password: "" });
  };

  const removeUser = async (id) => {
    await usersApi.remove(id);
    loadData();
  };

  const updateOrder = async (id, status) => {
    await ordersApi.update(id, status);
    loadData();
  };

  const deleteOrder = async (id) => {
    await ordersApi.remove(id);
    loadData();
  };

  return (
    <>
      <Navbar variant="dark" className="brand-bar py-3">
        <Container>
          <Navbar.Brand>Panel Espiritu Libre</Navbar.Brand>
          <div className="d-flex gap-2">
            <Button variant="outline-light" onClick={() => navigate("/")}>Tienda</Button>
            <Button variant="outline-light" onClick={logout}>Salir</Button>
          </div>
        </Container>
      </Navbar>

      <Container className="py-4">
        <div className="d-flex gap-2 mb-3">
          <Button variant={tab === "products" ? "primary" : "outline-primary"} onClick={() => setTab("products")}>Productos</Button>
          <Button variant={tab === "orders" ? "primary" : "outline-primary"} onClick={() => setTab("orders")}>Pedidos</Button>
          {user.role === "super-admin" && (
            <Button variant={tab === "users" ? "primary" : "outline-primary"} onClick={() => setTab("users")}>Usuarios</Button>
          )}
        </div>

        {error && <div className="alert alert-warning">{error}</div>}

        {tab === "products" && (
          <div className="panel-card p-3">
            <h2 className="h5">ABM de productos</h2>
            <Form onSubmit={saveProduct} className="row g-2 mb-3">
              <Form.Group className="col-md-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Categoria</Form.Label>
                <Form.Control value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Imagen URL</Form.Label>
                <Form.Control value={productForm.image || ""} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
              </Form.Group>
              <div className="col-12">
                <Button type="submit">{editingProduct ? "Guardar cambios" : "Crear producto"}</Button>
                {editingProduct && <Button variant="link" onClick={() => { setEditingProduct(null); setProductForm(emptyProduct); }}>Cancelar</Button>}
              </div>
            </Form>

            <Table responsive bordered hover>
              <thead><tr><th>Producto</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toLocaleString("es-AR")}</td>
                    <td>{product.stock}</td>
                    <td className="table-action">
                      <Button size="sm" variant="outline-primary" onClick={() => editProduct(product)}>Editar</Button>{" "}
                      <Button size="sm" variant="outline-danger" onClick={() => removeProduct(product.id)}>Baja</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {tab === "orders" && (
          <div className="panel-card p-3">
            <h2 className="h5">ABM de pedidos</h2>
            <Table responsive bordered hover>
              <thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_name}</td>
                    <td>{order.date}</td>
                    <td>${order.total.toLocaleString("es-AR")}</td>
                    <td><Badge bg={order.status === "confirmed" ? "success" : order.status === "cancelled" ? "danger" : "warning"}>{order.status}</Badge></td>
                    <td className="table-action">
                      <Form.Select size="sm" className="d-inline-block w-auto me-2" value={order.status} onChange={(e) => updateOrder(order.id, e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </Form.Select>
                      {user.role === "super-admin" && <Button size="sm" variant="outline-danger" onClick={() => deleteOrder(order.id)}>Baja</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {tab === "users" && user.role === "super-admin" && (
          <div className="panel-card p-3">
            <h2 className="h5">ABM de usuarios</h2>
            <Form onSubmit={saveUser} className="row g-2 mb-3">
              <Form.Group className="col-md-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Email</Form.Label>
                <Form.Control value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Contrasena</Form.Label>
                <Form.Control type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} disabled={Boolean(editingUser)} />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Rol</Form.Label>
                <Form.Select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="super-admin">super-admin</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>Activo</Form.Label>
                <Form.Select value={userForm.active ? "1" : "0"} onChange={(e) => setUserForm({ ...userForm, active: e.target.value === "1" })}>
                  <option value="1">Si</option>
                  <option value="0">No</option>
                </Form.Select>
              </Form.Group>
              <div className="col-12">
                <Button type="submit">{editingUser ? "Guardar cambios" : "Crear usuario"}</Button>
                {editingUser && <Button variant="link" onClick={() => { setEditingUser(null); setUserForm(emptyUser); }}>Cancelar</Button>}
              </div>
            </Form>

            <Table responsive bordered hover>
              <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr></thead>
              <tbody>
                {users.map((currentUser) => (
                  <tr key={currentUser.id}>
                    <td>{currentUser.name}</td>
                    <td>{currentUser.email}</td>
                    <td>{currentUser.role}</td>
                    <td>{currentUser.active ? "Si" : "No"}</td>
                    <td className="table-action">
                      <Button size="sm" variant="outline-primary" onClick={() => editUser(currentUser)}>Editar</Button>{" "}
                      <Button size="sm" variant="outline-danger" onClick={() => removeUser(currentUser.id)}>Baja</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
      <Modal show={false} />
    </>
  );
};

export default AdminLayout;
