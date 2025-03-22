
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { DataSourcesForm } from "@/components/settings/DataSourcesForm";
import { MistralAIForm } from "@/components/settings/MistralAIForm";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Configure integration URLs for monitoring and automation tools</CardDescription>
              </CardHeader>
              <CardContent>
                <DataSourcesForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mistral AI Configuration</CardTitle>
                <CardDescription>Configure your Mistral AI agent for the chatbot assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <MistralAIForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
