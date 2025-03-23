
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    // Only redirect if we have a user and loading is false and we're not already redirecting
    if (user && !loading && !redirecting) {
      setRedirecting(true);
      const from = location.state?.from?.pathname || "/";
      console.log("User is authenticated, redirecting to:", from);
      
      // Small timeout to prevent redirect loops
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [user, loading, navigate, location, redirecting]);

  // Show loading while authentication status is being checked
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading authentication status...</p>
      </div>
    );
  }

  // Don't render the auth form if user is authenticated (will be redirected by useEffect)
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">La-Sup Platform</CardTitle>
          <CardDescription>
            Cloud infrastructure management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <SignInForm />
            </TabsContent>
            <TabsContent value="register">
              <SignUpForm setActiveTab={setActiveTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
