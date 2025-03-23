
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Settings, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define invite user form schema with proper typing
const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "user", "viewer"], {
    required_error: "Please select a role",
  }),
});

type UserRole = "admin" | "user" | "viewer";

type UserData = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: UserRole;
}

const Administration = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Form for inviting users
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from profiles table using Supabase
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Get user emails through a custom query
      // Since we can't use RPC that's not defined in types, we'll use a direct query
      const { data: authUsers, error: authError } = await supabase
        .from('auth_users_view')
        .select('id, email, last_sign_in_at')
        .in('id', profiles?.map(profile => profile.id) || []);
        
      if (authError && authError.message !== "relation \"auth_users_view\" does not exist") {
        console.error("Could not fetch user details:", authError);
      }
      
      // Map and combine the data
      const mappedUsers = profiles?.map(profile => {
        const userDetails = authUsers?.find(u => u.id === profile.id);
        
        return {
          id: profile.id,
          email: userDetails?.email || `User ${profile.id.substring(0, 8)}...`,
          created_at: profile.created_at,
          last_sign_in_at: userDetails?.last_sign_in_at || null,
          role: profile.role as UserRole
        };
      }) || [];
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

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

  // Update user role
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Refresh the users list
      fetchUsers();
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  // Load users data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

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
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Sign In</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                            <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {user.role !== "admin" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateUserRole(user.id, "admin")}
                                  >
                                    Make Admin
                                  </Button>
                                )}
                                {user.role !== "user" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateUserRole(user.id, "user")}
                                  >
                                    Make User
                                  </Button>
                                )}
                                {user.role !== "viewer" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateUserRole(user.id, "viewer")}
                                  >
                                    Make Viewer
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  Total Users: {users.length}
                </div>
                <Button onClick={fetchUsers} variant="outline">
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="invite">
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
