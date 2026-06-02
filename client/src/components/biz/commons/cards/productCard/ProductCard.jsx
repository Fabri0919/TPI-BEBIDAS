import { Card, Button } from "react-bootstrap";
import { useCart } from "../../../contexts/CartContext";

const ProductCard = ({
  id,
  image,
  name,
  price,
  category,
  stock = 0,
  adminMode = false,
  onDelete,
  onUpdateStock,
}) => {
  const { addToCart, increaseQuantity, decreaseQuantity, getQuantity } =
    useCart();

  const quantity = getQuantity(id);

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={image}
        alt={name}
        style={{
          height: "220px",
          objectFit: "contain",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{name}</Card.Title>

        <Card.Text>{category}</Card.Text>

        <Card.Text className="fs-4 text-success fw-bold">
          ${price.toLocaleString("es-AR")}
        </Card.Text>

        {/* ================= USER MODE ================= */}
        {!adminMode && (
          <>
            {quantity === 0 ? (
              <Button
                variant="primary"
                className="mt-auto"
                onClick={() => addToCart(id)}
              >
                Agregar al carrito
              </Button>
            ) : (
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <Button variant="danger" onClick={() => decreaseQuantity(id)}>
                  -
                </Button>

                <span className="fw-bold fs-5">{quantity}</span>

                <Button variant="success" onClick={() => increaseQuantity(id)}>
                  +
                </Button>
              </div>
            )}
          </>
        )}

        {/* ================= ADMIN MODE ================= */}
        {adminMode && (
          <>
            <Card.Text>Stock: {stock}</Card.Text>

            <div className="d-flex gap-2 mt-auto">
              <Button variant="warning" onClick={() => onUpdateStock?.(id)}>
                Stock
              </Button>

              <Button
                variant="danger"
                disabled={stock !== 0}
                onClick={() => onDelete?.(id)}
              >
                Eliminar
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
