import { Navigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

// to protect every other routes that doesn't have /login or /signup in the path
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
