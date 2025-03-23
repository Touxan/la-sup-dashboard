
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Settings } from "lucide-react";

const Administration = () => {
  const { userRole } = useAuth();

  // Redirect non-admin users
  if (userRole !== "admin") {
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
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <p>Total Users: 12</p>
                  <p>Active Users: 8</p>
                  <p>Administrators: 2</p>
                  
                  {/* In a real application, you would have a table of users here */}
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-muted-foreground text-sm">
                      This is a placeholder for the user management interface. 
                      In a real application, this would be a table with user data and actions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <p>Environment: Production</p>
                  <p>API Version: 1.0.3</p>
                  <p>Last Backup: 2 days ago</p>
                  
                  {/* In a real application, you would have setting controls here */}
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-muted-foreground text-sm">
                      This is a placeholder for system settings. 
                      In a real application, this would contain forms to update various system configurations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Administration;
