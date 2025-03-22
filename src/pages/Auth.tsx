
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [invitation, setInvitation] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<{
    email?: string;
    role?: string;
    valid: boolean;
  }>({ valid: false });

  // Check for invitation token in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteToken = params.get("invitation");
    
    if (inviteToken) {
      setInvitation(inviteToken);
      verifyInvitation(inviteToken);
      setActiveTab("register");
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const verifyInvitation = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .eq("used", false)
        .single();

      if (error) throw error;
      
      // Check if invitation has expired
      if (new Date(data.expires_at) < new Date()) {
        setInvitationData({ valid: false });
        toast.error("L'invitation a expiré");
        return;
      }

      // Set email from invitation
      setEmail(data.email);
      setInvitationData({
        valid: true,
        email: data.email,
        role: data.role
      });
    } catch (error) {
      console.error("Error verifying invitation:", error);
      setInvitationData({ valid: false });
      toast.error("Invitation invalide ou expirée");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting sign in process");
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Sign in successful, navigating to home");
      toast.success("Connexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Specific error handling
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe invalide");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Veuillez confirmer votre email avant de vous connecter");
      } else {
        toast.error(error.message || "Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting sign up process");
    setLoading(true);
    
    // Block sign-up without invitation
    if (!invitation || !invitationData.valid) {
      toast.error("Une invitation valide est requise pour s'inscrire");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Attempting to sign up with:", { email });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
            role: invitationData.role || "user",
            invited_by: invitation
          },
        },
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      if (data?.user?.identities?.length === 0) {
        toast.error("Cet email est déjà enregistré. Veuillez vous connecter.");
        setActiveTab("login");
      } else if (data?.user) {
        // Mark invitation as used
        const { error: inviteError } = await supabase
          .from("invitations")
          .update({ used: true })
          .eq("token", invitation);
          
        if (inviteError) {
          console.error("Error marking invitation as used:", inviteError);
        }
          
        toast.success("Compte créé avec succès");
        
        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in (no email confirmation required)
          console.log("User session created, navigating to home");
          navigate("/");
        } else {
          // Email confirmation required
          toast.info("Veuillez vérifier votre email pour confirmer votre compte");
        }
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Erreur inattendue lors de l'inscription");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Specific error handling
      if (error.message.includes("already registered")) {
        toast.error("Cet email est déjà enregistré");
        setActiveTab("login");
      } else if (error.message.includes("Database error saving new user")) {
        toast.error("Erreur serveur lors de l'inscription. Veuillez réessayer plus tard.");
        console.error("Database error details:", error);
      } else {
        toast.error(error.message || "Erreur lors de la création du compte");
      }
    } finally {
      setLoading(false);
    }
  };

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
          {invitation && !invitationData.valid && (
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>Invitation invalide ou expirée</AlertTitle>
              <AlertDescription>
                Cette invitation n'est plus valide. Veuillez contacter un administrateur pour obtenir une nouvelle invitation.
              </AlertDescription>
            </Alert>
          )}
          
          {invitation && invitationData.valid && (
            <Alert className="mb-4">
              <AlertTitle>Invitation valide</AlertTitle>
              <AlertDescription>
                Vous avez été invité à rejoindre la plateforme avec l'email: {invitationData.email}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register" disabled={invitation === null}>
                Inscription
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    readOnly={invitationData.email !== undefined}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Créer un mot de passe"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !invitationData.valid}
                >
                  {loading ? "Création du compte..." : "Créer un compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
