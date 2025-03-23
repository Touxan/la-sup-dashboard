
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  console.log("AuthPage - Current auth state:", user ? "authenticated" : "not authenticated", "loading:", loading);
  
  // Handle redirection if user is authenticated
  useEffect(() => {
    // Only redirect if we have a user and loading is complete
    if (user && !loading && !isRedirecting) {
      console.log("User is authenticated in AuthPage, redirecting");
      setIsRedirecting(true);
      
      // Get the redirect path from location state or default to home
      const from = location.state?.from?.pathname || "/";
      
      // Use timeout to prevent redirection loops
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [user, loading, navigate, location, isRedirecting]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading authentication status...</p>
      </div>
    );
  }

  // If user is authenticated, show redirecting message
  if (user && !loading) {
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
