
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define invite user form schema with proper typing
const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "user", "viewer"], {
    required_error: "Please select a role",
  }),
});

type UserRole = "admin" | "user" | "viewer";

const UserInvitation = () => {
  // Form for inviting users
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  // Handle inviting a new user
  const onInviteUser = async (values: z.infer<typeof inviteFormSchema>) => {
    try {
      // Generate a random token for the invitation
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Set expiration date to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Insert the invitation into the database
      const { error } = await supabase
        .from('invitations')
        .insert({
          email: values.email,
          role: values.role,
          token: token,
          expires_at: expiresAt.toISOString(),
        });
      
      if (error) throw error;
      
      toast.success(`Invitation sent to ${values.email}`);
      form.reset();
      
      // In a real application, you would send an email with the invitation link
      // This would typically be done through a Supabase Edge Function
      
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Failed to send invitation");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite New User</CardTitle>
        <CardDescription>
          Send an invitation to a new user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onInviteUser)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user-role" />
                        <Label htmlFor="user-role">User - Basic access to the platform</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin-role" />
                        <Label htmlFor="admin-role">Admin - Full access including user management</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="viewer" id="viewer-role" />
                        <Label htmlFor="viewer-role">Viewer - Read-only access</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserInvitation;
