
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { Plus, Trash2, Edit, Shield, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSecurityGroupForm } from "@/components/security/CreateSecurityGroupForm";

// Types for security groups
export interface FirewallRule {
  id: string;
  direction: "inbound" | "outbound";
  protocol: "tcp" | "udp" | "icmp" | "all";
  ports: string; // Can be a range "80-443" or single port "22" or "all"
  source: string; // IP range or "any"
  action: "allow" | "deny";
  description: string;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  rules: FirewallRule[];
}

const SecurityGroups = () => {
  const { toast } = useToast();
  const [securityGroups, setSecurityGroups] = useState<SecurityGroup[]>([
    {
      id: "sg-1",
      name: "Web Servers",
      description: "Security group for web servers",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      rules: [
        {
          id: "rule-1",
          direction: "inbound",
          protocol: "tcp",
          ports: "80,443",
          source: "0.0.0.0/0",
          action: "allow",
          description: "Allow HTTP and HTTPS traffic",
        },
        {
          id: "rule-2",
          direction: "inbound",
          protocol: "tcp",
          ports: "22",
          source: "10.0.0.0/8",
          action: "allow",
          description: "Allow SSH from internal network",
        },
        {
          id: "rule-3",
          direction: "outbound",
          protocol: "all",
          ports: "all",
          source: "0.0.0.0/0",
          action: "allow",
          description: "Allow all outbound traffic",
        },
      ],
    },
    {
      id: "sg-2",
      name: "Database Servers",
      description: "Security group for database servers",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      rules: [
        {
          id: "rule-4",
          direction: "inbound",
          protocol: "tcp",
          ports: "3306",
          source: "10.0.0.0/8",
          action: "allow",
          description: "Allow MySQL traffic from internal network",
        },
        {
          id: "rule-5",
          direction: "inbound",
          protocol: "tcp",
          ports: "22",
          source: "10.0.0.0/8",
          action: "allow",
          description: "Allow SSH from internal network",
        },
      ],
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<SecurityGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateGroup = (newGroup: Omit<SecurityGroup, "id" | "createdAt">) => {
    const securityGroupToAdd: SecurityGroup = {
      id: `sg-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      ...newGroup,
    };

    setSecurityGroups([...securityGroups, securityGroupToAdd]);
    setIsDialogOpen(false);
    
    toast({
      title: "Security Group Created",
      description: `Security group "${newGroup.name}" has been created successfully.`,
    });
  };

  const handleEditGroup = (group: SecurityGroup) => {
    setSelectedGroup(group);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleUpdateGroup = (updatedGroup: Omit<SecurityGroup, "id" | "createdAt">) => {
    if (!selectedGroup) return;

    const updatedGroups = securityGroups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            name: updatedGroup.name,
            description: updatedGroup.description,
            rules: updatedGroup.rules,
          }
        : group
    );

    setSecurityGroups(updatedGroups);
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedGroup(null);
    
    toast({
      title: "Security Group Updated",
      description: `Security group "${updatedGroup.name}" has been updated successfully.`,
    });
  };

  const handleDeleteGroup = (id: string) => {
    const groupToDelete = securityGroups.find((group) => group.id === id);
    setSecurityGroups(securityGroups.filter((group) => group.id !== id));
    
    toast({
      title: "Security Group Deleted",
      description: `Security group "${groupToDelete?.name}" has been deleted.`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Security Groups</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setIsEditing(false);
                setSelectedGroup(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Security Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Edit Security Group" : "Create New Security Group"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the settings for this security group."
                    : "Configure the settings for your new security group."}
                </DialogDescription>
              </DialogHeader>
              
              <CreateSecurityGroupForm
                initialData={selectedGroup}
                isEditing={isEditing}
                onSubmit={isEditing ? handleUpdateGroup : handleCreateGroup}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Security Group Management</CardTitle>
            <CardDescription>
              Create and manage security groups for your infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        {group.name}
                      </div>
                    </TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{group.rules.length} rules</span>
                        <span className="flex">
                          <span className="text-xs rounded-md bg-green-100 text-green-800 px-2 py-1 mr-1">
                            {group.rules.filter(r => r.direction === "inbound").length} in
                          </span>
                          <span className="text-xs rounded-md bg-amber-100 text-amber-800 px-2 py-1">
                            {group.rules.filter(r => r.direction === "outbound").length} out
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SecurityGroups;
