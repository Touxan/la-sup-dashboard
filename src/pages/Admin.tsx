
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import InviteUsers from "@/components/admin/InviteUsers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error("Error checking admin role:", error);
        toast.error("Unable to verify admin permissions");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Vérification des permissions...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Redirect non-admin users
  if (isAdmin === false) {
    toast.error("Accès non autorisé");
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Panneau d'Administration</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            <TabsTrigger value="invites">Invitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="py-4">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="invites" className="py-4">
            <InviteUsers />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
