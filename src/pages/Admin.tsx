
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import InviteUsers from "@/components/admin/InviteUsers";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Admin = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // Check if the user is an admin
  if (userRole !== "admin") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <AlertDescription>
            Accès refusé. Vous devez être administrateur pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="invitations">
          <InviteUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
