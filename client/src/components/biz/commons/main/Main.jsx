import { Container } from "react-bootstrap";
import CategoriesContainer from "../containers/category/CategoriesContainer";
import ProductsContainer from "../containers/product/ProductsContainer";
import { useState } from "react";

const Main = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Container className="my-4">
      {selectedCategory ? (
        <ProductsContainer category={selectedCategory} />
      ) : (
        <CategoriesContainer
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}
    </Container>
  );
};

export default Main;
