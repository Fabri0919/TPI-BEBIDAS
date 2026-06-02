import { CartProvider } from "./components/biz/contexts/CartContext.jsx";
import { AuthProvider } from "./components/auth/AuthContext.jsx";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>,
);
