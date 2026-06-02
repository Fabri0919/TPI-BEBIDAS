import { Row, Col } from "react-bootstrap";
import CategoryCard from "../../cards/categoryCard/CategoryCard";
import { categories } from "../../../harcodedData/data";

const CategoriesContainer = ({ selectedCategory, onSelectCategory }) => {
  return (
    <Row className="g-3">
      {categories.map((category) => (
        <Col xs={12} sm={6} md={4} lg={3} key={category.id}>
          <CategoryCard
            image={category.imagen}
            name={category.nombre}
            selected={selectedCategory === category.nombre}
            onClick={() => onSelectCategory(category.nombre)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default CategoriesContainer;
