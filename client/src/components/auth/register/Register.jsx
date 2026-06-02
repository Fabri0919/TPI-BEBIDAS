import { useRef, useState } from "react";
import classNames from "classnames";
import { Row, Form, FormGroup, Col, Button, Card } from "react-bootstrap";
import { initialRegisterFormErrors, emailRegex, passwordRegex} from "../authData.js"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialRegisterFormErrors);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: false,
    }));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: false,
    }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (name === "") {
      nameInputRef.current.focus();
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: true,
      }));
      return;
    } else if (email === "" || !emailRegex.test(email)) {
      emailInputRef.current.focus();
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      return;
    } else if (password === "" || !passwordRegex.test(password)) {
      passwordInputRef.current.focus();
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: true,
      }));
      return;
    }
    setErrors(initialRegisterFormErrors);

    //Aqui iria la petición hacia el backend
    alert(`Bienvenido a espiritu libre ${name}`);
  };

  return (
    <Card className="mt-5 mx-3 p-3 px-5 shadow">
      <Card.Body>
        <Form onSubmit={handleRegister}>
          <FormGroup className="mb-4">
            <Form.Control
              type="text"
              className={classNames({
                "border border-danger": errors.name,
              })}
              ref={nameInputRef}
              placeholder="Ingresar nombre de usuario"
              onChange={handleNameChange}
              value={name}
            />
            {errors.name && (
              <p className="text-danger">El nombre es obligatorio.</p>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Form.Control
              type="text"
              className={classNames({
                "border border-danger": errors.email,
              })}
              ref={emailInputRef}
              placeholder="Ingresar email"
              onChange={handleEmailChange}
              value={email}
            />
            {errors.email && (
              <p className="text-danger">Email con formato incorrecto</p>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Form.Control
              className={classNames({
                "border border-danger": errors.password,
              })}
              type="password"
              ref={passwordInputRef}
              placeholder="Ingresar contraseña"
              onChange={handlePasswordChange}
              value={password}
            />
            {errors.password && (
              <div className="text-danger">
                <ul>
                  La contraseña debe:
                  <li>Tener 8 caracteres</li>
                  <li>Incluir una mayúscula</li>
                  <li>Incluir un número</li>
                </ul>
              </div>
            )}
          </FormGroup>
          <Row>
            <Col />
            <Col md={6} className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Registrarse
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;
