import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import { emailRegex, passwordRegex } from "../components/auth/authData";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const validate = () => {
    if (mode === "register" && form.name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (!emailRegex.test(form.email)) return "Ingrese un email valido.";
    if (!passwordRegex.test(form.password)) return "La contrasena debe tener 8 caracteres, una mayuscula y un numero.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      if (mode === "register") {
        await register(form);
        setMode("login");
        setError("Usuario creado. Ya puede iniciar sesion.");
        return;
      }

      const user = await login(form.email, form.password);
      navigate(user.role === "user" ? "/" : "/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="panel-card shadow-sm" style={{ width: "100%", maxWidth: 460 }}>
        <Card.Body className="p-4">
          <h1 className="h4 mb-1">{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h1>
          <p className="text-muted">Espiritu Libre</p>
          {error && <div className="alert alert-info">{error}</div>}
          <Form onSubmit={handleSubmit}>
            {mode === "register" && (
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contrasena</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Form.Group>
            <Button type="submit" className="w-100 mb-3">
              {mode === "login" ? "Ingresar" : "Registrarse"}
            </Button>
          </Form>
          <Button variant="link" className="p-0" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "No tengo cuenta" : "Ya tengo cuenta"}
          </Button>
          <div className="small text-muted mt-3">
            Pruebas: super@espiritulibre.com / Admin123, admin@espiritulibre.com / Admin123, cliente@espiritulibre.com / Cliente123
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthLayout;
