
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

// Define resource types
type Resource = {
  id: string;
  name: string;
  description: string;
};

// Action definitions - matching our permission_action enum in the database
const actions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Modify" },
  { id: "delete", label: "Delete" },
  { id: "execute", label: "Execute" },
];

type ApiKeyFormProps = {
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

export function ApiKeyForm({ onSubmit, onCancel }: ApiKeyFormProps) {
  const [showKey, setShowKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  
  // Fetch resources from database
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('id, name, description')
        .order('name');
      
      if (error) {
        toast.error(`Error fetching resources: ${error.message}`);
        return [];
      }
      
      return data;
    }
  });

  // Group resources by type
  const groupedResources = resources.reduce((acc: any, resource: Resource) => {
    // Get a human-readable group name based on resource name
    const groupName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
    
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    
    acc[groupName].push(resource);
    return acc;
  }, {});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Generate a secure API key with format 'sk_xxxx...'
    const mockKey = `sk_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(mockKey);
    setShowKey(true);
    
    // Create new API key object
    const newApiKey = {
      name: values.name,
      key: mockKey,
      permissions: values.permissions,
    };
    
    onSubmit(newApiKey);
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      {showKey ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-md border">
            <p className="text-sm font-medium mb-1">Your API Key</p>
            <div className="font-mono text-sm bg-background p-3 rounded border break-all">
              {generatedKey}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure to copy this API key now. You won't be able to see it again!
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} variant="outline">Close</Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Production API Key" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your API key</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormLabel>Permissions</FormLabel>
              <FormDescription>Select the permissions for this API key</FormDescription>
              
              {Object.entries(groupedResources).map(([groupName, groupResources]: [string, any]) => (
                <div key={groupName} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{groupName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupResources.map((resource: Resource) => (
                      actions.map(action => (
                        <FormField
                          key={`${action.id}:${resource.name}`}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            const permissionId = `${action.id}:${resource.name}`;
                            return (
                              <FormItem key={permissionId} className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permissionId)}
                                    onCheckedChange={(checked) => {
                                      const updatedPermissions = checked
                                        ? [...field.value, permissionId]
                                        : field.value.filter((value) => value !== permissionId);
                                      field.onChange(updatedPermissions);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {action.label} {resource.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))
                    ))}
                  </div>
                </div>
              ))}
              <FormMessage />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
              <Button type="submit">Generate API Key</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
