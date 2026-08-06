import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../../utils/UserContext";

const ProtectedRoute = ({ children }) => {
  const { loggedIn } = useContext(UserContext);
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;