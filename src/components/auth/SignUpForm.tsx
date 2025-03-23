
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignUpFormProps {
  setActiveTab: (tab: string) => void;
}

const SignUpForm = ({ setActiveTab }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting sign up process");
    setLoading(true);
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
            email: email,
          },
        },
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      if (data?.user?.identities?.length === 0) {
        toast.error("This email is already registered. Please sign in.");
        setActiveTab("login");
      } else if (data?.user) {
        toast.success("Account created successfully");
        
        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in (no email confirmation required)
          console.log("User session created, navigating to home");
          window.location.href = "/";
        } else {
          // Email confirmation required
          toast.info("Please check your email for confirmation");
        }
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Unexpected error during sign up");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Specific error handling
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered");
        setActiveTab("login");
      } else if (error.message.includes("Database error saving new user")) {
        toast.error("Server error during registration. Please try again later.");
        console.error("Database error details:", error);
      } else {
        toast.error(error.message || "Error creating account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sign-up-email">Email</Label>
        <Input 
          id="sign-up-email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sign-up-password">Password</Label>
        <Input 
          id="sign-up-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default SignUpForm;
