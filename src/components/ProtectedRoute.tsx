
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user' | 'viewer';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement...</p>
      </div>
    </div>;
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, show access denied
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <AlertDescription>
              Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
