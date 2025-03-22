
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Schema for form validation
const inviteSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  role: z.enum(["admin", "user", "viewer"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

// Interface for the invitation data from the database
interface Invitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
  used: boolean;
}

const InviteUsers = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "user",
    },
  });

  // Fetch invitations when component mounts
  useState(() => {
    fetchInvitations();
  });

  const fetchInvitations = async () => {
    try {
      setLoadingInvites(true);
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Impossible de récupérer les invitations");
    } finally {
      setLoadingInvites(false);
    }
  };

  const onSubmit = async (values: InviteFormValues) => {
    try {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: {
          email: values.email,
          role: values.role,
        },
      });

      if (error) throw error;
      
      toast.success("Invitation envoyée avec succès");
      form.reset();
      
      // Refresh the invitations list
      fetchInvitations();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Impossible d'envoyer l'invitation");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Inviter des Utilisateurs</h2>
        <div className="bg-card rounded-md border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="viewer">Lecteur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Envoyer l'invitation
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Invitations Récentes</h2>
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingInvites ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : invitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucune invitation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant={invite.role === "admin" ? "default" : "secondary"}>
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invite.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {invite.used ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">Utilisée</Badge>
                      ) : new Date(invite.expires_at) < new Date() ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700">Expirée</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">En attente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Re-envoyer l'invitation
                          toast.info("Fonctionnalité à venir");
                        }}
                        disabled={invite.used}
                      >
                        Renvoyer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InviteUsers;
