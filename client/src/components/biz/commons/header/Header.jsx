import { Navbar, Container, Button, Badge } from "react-bootstrap";
import { Cart } from "react-bootstrap-icons";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router";

const Header = () => {
const navigate = useNavigate();

const { totalItems, openCart } = useCart();
  return (
    <Navbar bg="dark" variant="dark" className="py-3">
      <Container>
        <Navbar.Brand>Espíritu Libre</Navbar.Brand>

        <div className="d-flex gap-2">
          <Button
            variant="outline-light"
            className="position-relative"
            onClick={openCart}
          >
            <Cart size={20} />

            {totalItems > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          <Button variant="light" onClick={() => navigate("/auth")}>Iniciar Sesión</Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
