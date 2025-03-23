
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Settings } from "lucide-react";

// Import the refactored component files
import UsersManagement from "@/components/admin/UsersManagement";
import UserInvitation from "@/components/admin/UserInvitation";
import SystemSettings from "@/components/admin/SystemSettings";

const Administration = () => {
  const { userRole, loading } = useAuth();
  
  console.log("Administration page - userRole:", userRole, "loading:", loading);

  // Show loading while the role is being determined
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Redirect non-admin users
  if (userRole !== "admin") {
    console.log("Non-admin user attempting to access admin page, redirecting");
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Administration</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="invite">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="invite">
            <UserInvitation />
          </TabsContent>
          
          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Administration;
