
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Terminal, 
  Tag, 
  Cloud, 
  Pen, 
  Save, 
  X, 
  Plus, 
  Search, 
  RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

interface Container {
  id: string;
  name: string;
  status: "running" | "stopped" | "restarting";
  image: string;
  created: string;
}

const ServerDetail = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllContainers, setShowAllContainers] = useState(false);

  // Mock server data - would be fetched from API
  const [serverData, setServerData] = useState({
    id: id || "1",
    name: "Web Server",
    ip: "192.168.1.100",
    description: "Production web server running NGINX",
    tags: ["production", "web", "nginx"],
    provider: "AWS",
    sshUser: "admin"
  });

  // Mock containers data - would be fetched from n8n API
  const [containers, setContainers] = useState<Container[]>([
    { id: "1", name: "nginx", status: "running", image: "nginx:latest", created: "2023-05-15" },
    { id: "2", name: "postgres", status: "running", image: "postgres:14", created: "2023-05-15" },
    { id: "3", name: "redis", status: "running", image: "redis:alpine", created: "2023-05-15" },
    { id: "4", name: "mongodb", status: "stopped", image: "mongo:latest", created: "2023-05-16" },
    { id: "5", name: "nodejs-app", status: "running", image: "node:16", created: "2023-05-16" },
    { id: "6", name: "elastic", status: "running", image: "elasticsearch:8", created: "2023-05-17" },
    { id: "7", name: "kibana", status: "running", image: "kibana:8", created: "2023-05-17" },
  ]);

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success("Server information updated successfully");
  };

  const handleAddTag = () => {
    if (newTag && !serverData.tags.includes(newTag)) {
      setServerData({
        ...serverData,
        tags: [...serverData.tags, newTag]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setServerData({
      ...serverData,
      tags: serverData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCopySSH = () => {
    const sshCommand = `ssh ${serverData.sshUser}@${serverData.ip}`;
    navigator.clipboard.writeText(sshCommand);
    toast.success("SSH command copied to clipboard");
  };

  const handleRestartContainer = (containerId: string) => {
    toast.success(`Container ${containerId} restart initiated`);
    // Would call n8n API to restart container
  };

  const filteredContainers = containers.filter(container => 
    container.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleContainers = showAllContainers 
    ? filteredContainers 
    : filteredContainers.slice(0, 5);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Server Details</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Pen className="mr-2 h-4 w-4" />
              Edit Server
            </Button>
          ) : (
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Server Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        value={serverData.name} 
                        onChange={(e) => setServerData({...serverData, name: e.target.value})}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">{serverData.name}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ip">IP Address</Label>
                    <div className="p-2 bg-muted rounded-md">{serverData.ip}</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Input 
                      id="description" 
                      value={serverData.description} 
                      onChange={(e) => setServerData({...serverData, description: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{serverData.description}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="provider">Provider</Label>
                  {isEditing ? (
                    <Input 
                      id="provider" 
                      value={serverData.provider} 
                      onChange={(e) => setServerData({...serverData, provider: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Cloud className="h-4 w-4 mr-2" />
                      {serverData.provider}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {serverData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        {isEditing && (
                          <button 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          className="w-24 h-8"
                        />
                        <Button size="sm" variant="outline" onClick={handleAddTag}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SSH Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sshCommand">SSH Command</Label>
                  <div className="flex mt-2">
                    <div className="flex-grow p-2 bg-muted rounded-l-md font-mono text-sm overflow-x-auto">
                      ssh {serverData.sshUser}@{serverData.ip}
                    </div>
                    <Button 
                      variant="default" 
                      className="rounded-l-none" 
                      onClick={handleCopySSH}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {isEditing && (
                  <div>
                    <Label htmlFor="sshUser">SSH User</Label>
                    <Input 
                      id="sshUser" 
                      value={serverData.sshUser} 
                      onChange={(e) => setServerData({...serverData, sshUser: e.target.value})}
                    />
                  </div>
                )}
                <div className="pt-4">
                  <Button className="w-full" variant="outline">
                    <Terminal className="mr-2 h-4 w-4" />
                    Web Terminal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="metrics" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
          </TabsList>
          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">CPU Usage</h3>
                    <iframe 
                      src="https://sup-grafana.unipile.com/d-solo/rYdddlPWk/sys-usage-info-node-exporter-full?orgId=1&from=1741358392746&to=1741444792746&timezone=browser&var-datasource=fe7mcd5cvfda8d&var-job=node_exporter_Api2&var-node=62.210.88.117:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m&panelId=20&__feature.dashboardSceneSolo" 
                      width="100%" 
                      height="200" 
                      frameBorder="0"
                      title="CPU Usage"
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-2">Memory Usage</h3>
                    <iframe 
                      src="https://sup-grafana.unipile.com/d-solo/rYdddlPWk/sys-usage-info-node-exporter-full?orgId=1&from=1741358392746&to=1741444792746&timezone=browser&var-datasource=fe7mcd5cvfda8d&var-job=node_exporter_Api2&var-node=62.210.88.117:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m&panelId=20&__feature.dashboardSceneSolo" 
                      width="100%" 
                      height="200" 
                      frameBorder="0"
                      title="Memory Usage"
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-2">Disk Usage</h3>
                    <iframe 
                      src="https://sup-grafana.unipile.com/d-solo/rYdddlPWk/sys-usage-info-node-exporter-full?orgId=1&from=1741358392746&to=1741444792746&timezone=browser&var-datasource=fe7mcd5cvfda8d&var-job=node_exporter_Api2&var-node=62.210.88.117:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m&panelId=20&__feature.dashboardSceneSolo" 
                      width="100%" 
                      height="200" 
                      frameBorder="0"
                      title="Disk Usage"
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="text-md font-medium mb-2">System Load</h3>
                    <iframe 
                      src="https://sup-grafana.unipile.com/d-solo/rYdddlPWk/sys-usage-info-node-exporter-full?orgId=1&from=1741358392746&to=1741444792746&timezone=browser&var-datasource=fe7mcd5cvfda8d&var-job=node_exporter_Api2&var-node=62.210.88.117:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m&panelId=20&__feature.dashboardSceneSolo" 
                      width="100%" 
                      height="200" 
                      frameBorder="0"
                      title="System Load"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="containers">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Containers</CardTitle>
                  <div className="w-64 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search containers..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Name</th>
                        <th className="h-10 px-4 text-left font-medium">Status</th>
                        <th className="h-10 px-4 text-left font-medium">Image</th>
                        <th className="h-10 px-4 text-left font-medium">Created</th>
                        <th className="h-10 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleContainers.map((container) => (
                        <tr key={container.id} className="border-b">
                          <td className="p-4 font-medium">{container.name}</td>
                          <td className="p-4">
                            <Badge 
                              variant={
                                container.status === "running" 
                                  ? "default" 
                                  : container.status === "stopped" 
                                    ? "destructive" 
                                    : "secondary"
                              }
                            >
                              {container.status}
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-sm">{container.image}</td>
                          <td className="p-4">{container.created}</td>
                          <td className="p-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRestartContainer(container.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredContainers.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllContainers(!showAllContainers)}
                    >
                      {showAllContainers ? "Show Less" : `Show All (${filteredContainers.length})`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ServerDetail;
