import { Modal, Button, Image } from "react-bootstrap";
import { useCart } from "../../contexts/CartContext";
import { products } from "../../harcodedData/data";

const CartModal = () => {
  const { cart, showCart, closeCart, clearCart } = useCart();

  const cartWithProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    return {
      ...product,
      quantity: item.quantity,
      subtotal: product.precio * item.quantity,
    };
  });

  const total = cartWithProducts.reduce((acc, item) => acc + item.subtotal, 0);

  const handleConfirm = () => {
    alert("Pedido confirmado ✔️");
    clearCart();
    closeCart();
  };

  const handleCancel = () => {
    clearCart();
    closeCart();
  };

  return (
    <Modal show={showCart} onHide={closeCart} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tu carrito</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {cartWithProducts.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          cartWithProducts.map((item) => (
            <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
              <Image
                src={item.imagen}
                rounded
                style={{ width: 60, height: 60, objectFit: "cover" }}
              />

              <div className="flex-grow-1">
                <h6 className="mb-0">{item.nombre}</h6>
                <small>Cant: {item.quantity}</small>
              </div>

              <strong>${item.subtotal.toLocaleString("es-AR")}</strong>
            </div>
          ))
        )}
      </Modal.Body>

      <Modal.Footer className="flex-column w-100">
        <h5>Total: ${total.toLocaleString("es-AR")}</h5>

        <div className="d-flex gap-2 w-100">
          <Button variant="danger" className="w-50" onClick={handleCancel}>
            Cancelar pedido
          </Button>

          <Button
            variant="success"
            className="w-50"
            onClick={handleConfirm}
            disabled={cart.length === 0}
          >
            Confirmar pedido
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
