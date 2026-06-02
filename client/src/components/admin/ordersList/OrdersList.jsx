import { useState } from "react";
import { Table, Badge, Modal, Button, Form } from "react-bootstrap";
import { users, products } from "../../biz/harcodedData/data";

const OrdersList = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ---------------- STATUS ----------------
  const getStatusVariant = (estado) => {
    switch (estado) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "warning";
    }
  };

  // ---------------- HELPERS ----------------
  const getUser = (id) => users.find((u) => u.id === id);

  const getProduct = (id) => products.find((p) => p.id === id);

  const calculateTotal = (order) => {
    return order.products.reduce((acc, item) => {
      const product = getProduct(item.idProduct);
      if (!product) return acc;
      return acc + product.precio * item.qty;
    }, 0);
  };

  // ---------------- UPDATE STATUS GLOBAL ----------------
  const updateOrderStatus = (id, newStatus) => {
    alert(`Orden ${id}  con estado modificado a ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="p-3 border rounded bg-light">
      <h3 className="mb-3">Pedidos</h3>

      {/* ---------------- TABLE ---------------- */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay pedidos
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const user = getUser(order.user);

              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{order.id}</td>

                  <td>{user ? user.nombre : "Usuario no encontrado"}</td>

                  <td>{order.fecha}</td>

                  <td>
                    <Badge bg={getStatusVariant(order.estado)}>
                      {order.estado}
                    </Badge>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {/* ---------------- MODAL ---------------- */}
      <Modal
        show={selectedOrder !== null}
        onHide={() => setSelectedOrder(null)}
        centered
      >
        {selectedOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Pedido #{selectedOrder.id}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {/* USER INFO */}
              <div className="mb-3">
                <strong>Usuario:</strong> {getUser(selectedOrder.user)?.nombre}
              </div>

              {/* PRODUCTS */}
              <h5>Productos</h5>

              {selectedOrder.products.map((p) => {
                const product = getProduct(p.idProduct);

                return (
                  <div
                    key={p.idProduct}
                    className="d-flex justify-content-between mb-2"
                  >
                    <span>
                      {product?.nombre || "Producto eliminado"} x {p.qty}
                    </span>

                    <span>${((product?.precio || 0) * p.qty).toFixed(2)}</span>
                  </div>
                );
              })}

              <hr />

              {/* TOTAL */}
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${calculateTotal(selectedOrder).toFixed(2)}</span>
              </div>

              <hr />

              {/* STATUS EDIT */}
              <Form.Select
                value={selectedOrder.estado}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    estado: e.target.value,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, selectedOrder.estado);

                  setSelectedOrder(null);
                }}
              >
                Guardar cambios
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrdersList;
