
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { DataSourcesForm } from "@/components/settings/DataSourcesForm";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account preferences and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Configure integration URLs for monitoring and automation tools</CardDescription>
          </CardHeader>
          <CardContent>
            <DataSourcesForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
