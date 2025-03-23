
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserRole = "admin" | "user" | "viewer";

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
    console.log("Setting up auth state listener");
    let mounted = true;
    
    async function initializeAuth() {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event, currentSession ? "Session exists" : "No session");
            
            if (!mounted) return;
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              // Fetch user role from the database
              await fetchUserRole(currentSession.user.id);
            } else {
              setUserRole("user");
              setLoading(false);
            }
            
            if (event === 'SIGNED_IN') {
              console.log("User signed in:", currentSession?.user?.email);
              console.log("User details:", currentSession?.user);
              toast.success("Successfully signed in");
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              toast.info("Signed out");
              setLoading(false);
            }
          }
        );

        // THEN check for existing session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        console.log("Initial auth session:", initialSession ? "Authenticated" : "Not authenticated");
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          // Fetch user role from the database
          await fetchUserRole(initialSession.user.id);
        } else {
          setLoading(false);
        }
        
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    initializeAuth();
    
    return () => {
      mounted = false;
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }
      
      if (data) {
        console.log("User role found:", data.role);
        // Ensure we're processing the role correctly
        if (data.role === 'admin' || data.role === 'user' || data.role === 'viewer') {
          setUserRole(data.role as UserRole);
          console.log("User role set to:", data.role);
        } else {
          console.error("Unexpected role format:", data.role);
          setUserRole("user"); // Default to user if unexpected format
        }
      } else {
        console.log("No user role found, defaulting to 'user'");
        setUserRole("user");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      // Default to user role if there's an error
      setUserRole("user");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting sign out process");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Error signing out");
        throw error;
      }
      console.log("Sign out successful");
      // Force navigation to auth page
      window.location.href = "/auth";
    } catch (error) {
      console.error("Exception during sign out:", error);
      toast.error("Error signing out");
    } finally {
      setLoading(false);
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
