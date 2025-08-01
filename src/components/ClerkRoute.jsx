import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useContext";


const ClerkRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return "Loading";

  if (!isAuthenticated || user?.role !== "clerk") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ClerkRoute;