import Form from "react-bootstrap/Form";



const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <Form className="my-4">
      <Form.Control
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
