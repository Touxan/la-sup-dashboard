
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, KeyRound, Plus, Trash, Lock } from "lucide-react";
import { ApiKeyForm } from "@/components/apikeys/ApiKeyForm";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";

// Mock data for API keys
const initialApiKeys = [
  { id: "1", name: "Production API Key", key: "sk_prod_123456789abcdef", createdAt: "2023-06-15", permissions: ["read:servers", "write:servers", "read:metrics"] },
  { id: "2", name: "Monitoring Key", key: "sk_mon_987654321fedcba", createdAt: "2023-07-22", permissions: ["read:metrics", "read:alerts"] },
  { id: "3", name: "Test Environment Key", key: "sk_test_abcdef123456789", createdAt: "2023-09-05", permissions: ["read:servers", "write:workflows"] }
];

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateKey = (newKey: typeof apiKeys[0]) => {
    setApiKeys([...apiKeys, newKey]);
    setIsFormOpen(false);
    toast.success("API key created successfully");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("API key deleted successfully");
  };

  // Function to mask API keys for display
  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">API Keys</h1>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-background/95 backdrop-blur-md border border-border/50">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key with specific permissions. Save the key securely as it won't be displayed again.
                </DialogDescription>
              </DialogHeader>
              <ApiKeyForm onSubmit={handleCreateKey} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>Manage your API keys for accessing the platform programmatically</CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <KeyRound className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No API keys found. Create your first API key to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                          {apiKey.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center">
                          <Lock className="mr-2 h-3 w-3 text-muted-foreground" />
                          {maskApiKey(apiKey.key)}
                        </div>
                      </TableCell>
                      <TableCell>{apiKey.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ApiKeys;
