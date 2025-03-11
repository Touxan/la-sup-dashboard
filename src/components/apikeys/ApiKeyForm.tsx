
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

// Available permissions grouped by resource
const permissionGroups = [
  {
    resource: "Servers",
    permissions: [
      { id: "read:servers", label: "Read Servers" },
      { id: "write:servers", label: "Modify Servers" },
      { id: "delete:servers", label: "Delete Servers" },
    ],
  },
  {
    resource: "Workflows",
    permissions: [
      { id: "read:workflows", label: "Read Workflows" },
      { id: "write:workflows", label: "Modify Workflows" },
      { id: "execute:workflows", label: "Execute Workflows" },
    ],
  },
  {
    resource: "Monitoring",
    permissions: [
      { id: "read:metrics", label: "Read Metrics" },
      { id: "read:alerts", label: "Read Alerts" },
      { id: "write:alerts", label: "Configure Alerts" },
    ],
  },
  {
    resource: "Security",
    permissions: [
      { id: "read:security", label: "Read Security Groups" },
      { id: "write:security", label: "Modify Security Groups" },
      { id: "read:certificates", label: "Read Certificates" },
    ],
  },
];

type ApiKeyFormProps = {
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

export function ApiKeyForm({ onSubmit, onCancel }: ApiKeyFormProps) {
  const [showKey, setShowKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Generate a mock API key
    const mockKey = `sk_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(mockKey);
    setShowKey(true);
    
    // Create new API key object
    const newApiKey = {
      id: Date.now().toString(),
      name: values.name,
      key: mockKey,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: values.permissions,
    };
    
    onSubmit(newApiKey);
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
              
              {permissionGroups.map((group) => (
                <div key={group.resource} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{group.resource}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.permissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem key={permission.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-muted/50">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  const updatedPermissions = checked
                                    ? [...field.value, permission.id]
                                    : field.value.filter((value) => value !== permission.id);
                                  field.onChange(updatedPermissions);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {permission.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
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
