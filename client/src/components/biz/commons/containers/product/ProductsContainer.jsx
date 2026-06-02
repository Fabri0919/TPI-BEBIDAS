import { Row, Col } from "react-bootstrap";
import ProductCard from "../../cards/productCard/ProductCard";
import SearchBar from "../../search/SearchBar";
import { products } from "../../../harcodedData/data";
import { useState } from "react";

const ProductsContainer = ({ category }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.categoria === category &&
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

   
  return (
    <>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <Row className="g-3">
        {filteredProducts.map((fp) => (
          <Col xs={12} md={6} lg={4} key={fp.id}>
            <ProductCard
              id={fp.id}
              name={fp.nombre}
              image={fp.imagen}
              price={fp.precio}
              category={fp.categoria}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductsContainer;
