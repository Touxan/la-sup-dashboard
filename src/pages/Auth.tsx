
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Invitation } from "@/types/invitations";

const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

const signupSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Get invitation token from URL
  const searchParams = new URLSearchParams(location.search);
  const invitationToken = searchParams.get("invitation");
  
  // Form setup
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Check for invitation on mount
  useEffect(() => {
    const checkInvitation = async () => {
      if (invitationToken) {
        try {
          const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('token', invitationToken)
            .single();
          
          if (error) throw error;
          
          // Check if invitation is expired
          if (new Date(data.expires_at) < new Date()) {
            toast.error("Cette invitation a expiré");
            return;
          }
          
          // Check if invitation is already used
          if (data.used) {
            toast.error("Cette invitation a déjà été utilisée");
            return;
          }
          
          setInvitation(data as Invitation);
          signupForm.setValue("email", data.email);
          setActiveTab("signup");
        } catch (error) {
          console.error("Erreur lors de la vérification de l'invitation:", error);
          toast.error("Invitation invalide");
        }
      }
    };
    
    checkInvitation();
  }, [invitationToken, signupForm]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);
  
  const onLoginSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      // Navigation will happen in the useEffect hook that monitors user state
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSignupSubmit = async (values: SignupValues) => {
    if (!invitation) {
      toast.error("Vous avez besoin d'une invitation pour créer un compte");
      return;
    }
    
    setIsLoading(true);
    try {
      // Register the user
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: invitation.role,
          },
        },
      });
      
      if (error) throw error;
      
      // Mark the invitation as used
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ used: true })
        .eq('token', invitationToken!);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour de l'invitation:", updateError);
      }
      
      toast.success("Compte créé avec succès");
      // Navigation will happen in the useEffect hook that monitors user state
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Plateforme Cloud Admin</h1>
          <p className="text-muted-foreground mt-2">
            {invitation 
              ? `Bienvenue ! Vous avez été invité en tant que ${invitation.role}.` 
              : "Connectez-vous pour accéder à votre tableau de bord"}
          </p>
        </div>
        
        {!invitation && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup" disabled>Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="votre@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                        Connexion...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>L'inscription est uniquement sur invitation.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <Alert className="mb-6">
                <AlertDescription>
                  L'inscription n'est possible que sur invitation.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        )}
        
        {invitation && (
          <div className="mt-6">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre@email.com"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                      Création du compte...
                    </>
                  ) : (
                    "Créer un compte"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
