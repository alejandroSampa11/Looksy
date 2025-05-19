
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicOnlyRoute;
