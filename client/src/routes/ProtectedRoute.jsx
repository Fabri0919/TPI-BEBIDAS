import { Navigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
