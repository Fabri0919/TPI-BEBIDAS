import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, Navbar, Row, Spinner } from "react-bootstrap";
import { Cart, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import { useCart } from "../components/biz/contexts/CartContext";
import { ordersApi, productsApi } from "../services/api";

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart, totalItems, addToCart, increaseQuantity, decreaseQuantity, clearCart, showCart, openCart, closeCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setProducts(await productsApi.list());
    setLoading(false);
  };

  useEffect(() => {
    loadProducts().catch((err) => {
      setMessage(err.message);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => ["Todas", ...new Set(products.map((product) => product.category))], [products]);
  const filteredProducts = products.filter((product) => {
    const byCategory = category === "Todas" || product.category === category;
    const bySearch = product.name.toLowerCase().includes(search.toLowerCase());
    return byCategory && bySearch;
  });

  const cartProducts = cart
    .map((item) => {
      const product = products.find((current) => current.id === item.productId);
      return product ? { ...product, quantity: item.quantity, subtotal: product.price * item.quantity } : null;
    })
    .filter(Boolean);
  const total = cartProducts.reduce((acc, item) => acc + item.subtotal, 0);

  const confirmOrder = async () => {
    if (!user) {
      closeCart();
      navigate("/auth");
      return;
    }

    await ordersApi.create(cart);
    clearCart();
    closeCart();
    setMessage("Pedido creado correctamente. Puede verlo en su historial.");
    loadProducts();
  };

  return (
    <>
      <Navbar variant="dark" className="brand-bar py-3">
        <Container>
          <Navbar.Brand>Espiritu Libre</Navbar.Brand>
          <div className="d-flex gap-2 align-items-center">
            {user && <span className="text-white small">{user.name} · {user.role}</span>}
            <Button variant="outline-light" className="position-relative" onClick={openCart}>
              <Cart size={20} />
              {totalItems > 0 && <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">{totalItems}</Badge>}
            </Button>
            {user?.role !== "user" && user && <Button variant="light" onClick={() => navigate("/admin")}>Panel</Button>}
            {user ? (
              <Button variant="outline-light" onClick={logout}><BoxArrowRight /></Button>
            ) : (
              <Button variant="light" onClick={() => navigate("/auth")}>Iniciar sesion</Button>
            )}
          </div>
        </Container>
      </Navbar>

      <Container className="page-shell py-4">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between mb-4">
          <div>
            <h1 className="h3 mb-1">Catalogo de bebidas</h1>
            <p className="text-muted mb-0">Seleccione productos y arme su pedido.</p>
          </div>
          <div className="d-flex gap-2">
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </Form.Select>
            <Form.Control placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}
        {loading ? (
          <div className="text-center py-5"><Spinner /></div>
        ) : (
          <Row className="g-3">
            {filteredProducts.map((product) => (
              <Col xs={12} md={6} lg={4} key={product.id}>
                <Card className="product-card h-100">
                  <Card.Img className="product-image" variant="top" src={product.image} />
                  <Card.Body className="d-flex flex-column">
                    <Badge bg="secondary" className="align-self-start mb-2">{product.category}</Badge>
                    <Card.Title className="h6">{product.name}</Card.Title>
                    <Card.Text className="text-muted mb-2">Stock disponible: {product.stock}</Card.Text>
                    <strong className="mb-3">${product.price.toLocaleString("es-AR")}</strong>
                    <Button className="mt-auto" disabled={product.stock <= 0} onClick={() => addToCart(product.id)}>
                      Agregar al carrito
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal show={showCart} onHide={closeCart} centered>
        <Modal.Header closeButton>
          <Modal.Title>Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartProducts.length === 0 ? <p>El carrito esta vacio.</p> : cartProducts.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: "contain" }} />
              <div className="flex-grow-1">
                <strong>{item.name}</strong>
                <div className="small text-muted">${item.price.toLocaleString("es-AR")} c/u</div>
              </div>
              <Button size="sm" variant="outline-secondary" onClick={() => decreaseQuantity(item.id)}>-</Button>
              <span>{item.quantity}</span>
              <Button size="sm" variant="outline-secondary" onClick={() => increaseQuantity(item.id)}>+</Button>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <strong>Total: ${total.toLocaleString("es-AR")}</strong>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={clearCart}>Vaciar</Button>
            <Button disabled={cartProducts.length === 0} onClick={confirmOrder}>Confirmar pedido</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainLayout;
