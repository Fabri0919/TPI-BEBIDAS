import { Card, Button } from "react-bootstrap";

const CategoryCard = ({
  image,
  name,
  selected,
  onClick,
  adminMode = false,
  onDelete,
  hasStock = true,
}) => {
  return (
    <Card
      className="h-100 shadow-sm"
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
      border={selected ? "primary" : ""}
      onClick={!adminMode ? onClick : undefined}
    >
      <Card.Img
        variant="top"
        src={image}
        alt={name}
        style={{
          height: "180px",
          objectFit: "cover",
        }}
      />

      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        <Card.Title className="mb-2 text-center fw-bold">{name}</Card.Title>

        {adminMode && (
          <Button
            variant="danger"
            size="sm"
            disabled={hasStock}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            Eliminar categoría
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;
