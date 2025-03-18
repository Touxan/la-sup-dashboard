
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, KeyRound, Plus, Trash, Lock } from "lucide-react";
import { ApiKeyForm } from "@/components/apikeys/ApiKeyForm";
import MainLayout from "@/components/MainLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Type for API keys from database
type ApiKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
  permissions: {
    id: string;
    action: string;
    resource: {
      name: string;
    };
  }[];
};

const ApiKeys = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch API keys
  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('api_keys')
        .select(`
          id, 
          name, 
          key, 
          created_at,
          api_key_permissions(
            id,
            action,
            resource:resource_id(name)
          )
        `)
        .eq('user_id', user.id);
      
      if (error) {
        toast.error(`Error fetching API keys: ${error.message}`);
        return [];
      }
      
      // Transform data to match our expected format
      return data.map(key => ({
        ...key,
        created_at: new Date(key.created_at).toLocaleDateString(),
        permissions: key.api_key_permissions.map((perm: any) => ({
          id: perm.id,
          action: perm.action,
          resource: {
            name: perm.resource.name
          }
        }))
      }));
    },
    enabled: !!user
  });

  // Create API key mutation
  const createApiKey = useMutation({
    mutationFn: async (newKey: {
      name: string;
      key: string;
      permissions: string[];
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      // 1. Insert the API key
      const { data: keyData, error: keyError } = await supabase
        .from('api_keys')
        .insert({
          name: newKey.name,
          key: newKey.key,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (keyError) throw keyError;
      
      // 2. Get resource IDs for the permissions
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('id, name');
      
      if (resourcesError) throw resourcesError;
      
      // 3. Create permissions mapping
      const permissionsToInsert = [];
      
      for (const permString of newKey.permissions) {
        // Format: "read:servers", "write:workflows", etc.
        const [action, resourceName] = permString.split(':');
        const resourceId = resources.find(r => r.name === resourceName)?.id;
        
        if (resourceId) {
          permissionsToInsert.push({
            api_key_id: keyData.id,
            resource_id: resourceId,
            action: action
          });
        }
      }
      
      // 4. Insert permissions
      const { error: permError } = await supabase
        .from('api_key_permissions')
        .insert(permissionsToInsert);
      
      if (permError) throw permError;
      
      return { id: keyData.id, ...newKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast.success("API key created successfully");
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error creating API key: ${error.message}`);
    }
  });

  // Delete API key mutation
  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      toast.success("API key deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Error deleting API key: ${error.message}`);
    }
  });

  const handleCreateKey = (newKey: any) => {
    createApiKey.mutate(newKey);
  };

  const handleDeleteKey = (id: string) => {
    deleteApiKey.mutate(id);
  };

  // Function to mask API keys for display
  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  // Format permissions for display
  const formatPermissions = (perms: any[]) => {
    return perms.map(p => `${p.action}:${p.resource.name}`);
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
            {isLoading ? (
              <div className="text-center py-6">Loading API keys...</div>
            ) : apiKeys.length === 0 ? (
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
                  {apiKeys.map((apiKey: ApiKey) => (
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
                      <TableCell>{apiKey.created_at}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {formatPermissions(apiKey.permissions).map((permission, index) => (
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
