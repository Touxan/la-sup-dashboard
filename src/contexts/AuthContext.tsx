
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserRole = "user" | "admin";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("user");

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial auth session:", session ? "Authenticated" : "Not authenticated");
      setSession(session);
      setUser(session?.user ?? null);
      
      // For demo purposes, set some users as admin
      // In a real app, you would fetch this from a database
      const adminEmails = ["admin@example.com", "pablo.barpro@gmail.com"];
      if (session?.user && adminEmails.includes(session.user.email || "")) {
        setUserRole("admin");
      } else {
        setUserRole("user");
      }
      
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update user role when auth state changes
        const adminEmails = ["admin@example.com", "pablo.barpro@gmail.com"];
        if (session?.user && adminEmails.includes(session.user.email || "")) {
          setUserRole("admin");
        } else {
          setUserRole("user");
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", session?.user?.email);
          console.log("User details:", session?.user);
          toast.success("Successfully signed in");
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          toast.info("Signed out");
        } else if (event === 'USER_UPDATED') {
          console.log("User updated:", session?.user);
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log("Password recovery event");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
        } else {
          console.log("Other auth event:", event);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Starting sign out process");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Error signing out");
        throw error;
      }
      console.log("Sign out successful");
    } catch (error) {
      console.error("Exception during sign out:", error);
      toast.error("Error signing out");
    }
  };

  const value = {
    session,
    user,
    loading,
    userRole,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
