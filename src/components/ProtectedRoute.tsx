
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - user:", user ? "exists" : "null", "loading:", loading, "userRole:", userRole);
  console.log("Current path:", location.pathname);
  
  // Check if current path is an admin-only route
  const isAdminRoute = location.pathname.startsWith("/administration");
  
  // Show loading spinner only if we're still in the initial loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("No user, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If trying to access admin route without admin role
  if (isAdminRoute && userRole !== "admin") {
    console.log("User role:", userRole, "- Not authorized for admin route, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log("User authenticated with role:", userRole, "rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
