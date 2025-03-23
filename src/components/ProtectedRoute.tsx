
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - user:", user ? "exists" : "null");

  if (!user) {
    console.log("No user, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
