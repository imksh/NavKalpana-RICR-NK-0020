import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;