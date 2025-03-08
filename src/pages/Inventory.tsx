
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Tag, Cloud, Info, ExternalLink } from "lucide-react";
import AddServerForm from "@/components/inventory/AddServerForm";
import SyncCloudForm from "@/components/inventory/SyncCloudForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Type pour un serveur
interface Server {
  id: string;
  name: string;
  ip: string;
  description: string;
  tags: string[];
  provider: string;
}

const Inventory = () => {
  const [servers, setServers] = useState<Server[]>([
    {
      id: "1",
      name: "Web Server",
      ip: "192.168.1.100",
      description: "Production web server",
      tags: ["production", "web"],
      provider: "AWS",
    },
    {
      id: "2",
      name: "Database Server",
      ip: "192.168.1.101",
      description: "Primary database server",
      tags: ["production", "database"],
      provider: "GCP",
    },
    {
      id: "3",
      name: "Dev Environment",
      ip: "192.168.1.102",
      description: "Development environment",
      tags: ["development", "testing"],
      provider: "Azure",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showSyncForm, setShowSyncForm] = useState(false);

  // Fonction pour ajouter un nouveau serveur (sera implémentée avec l'API)
  const addServer = (server: Omit<Server, "id">) => {
    const newServer = {
      ...server,
      id: Math.random().toString(36).substring(7),
    };
    setServers([...servers, newServer]);
    setShowAddForm(false);
  };

  // Fonction pour synchroniser avec le cloud (sera implémentée avec l'API)
  const syncWithCloud = (provider: string) => {
    console.log(`Syncing with ${provider}`);
    setShowSyncForm(false);
    // Ici, nous ajouterions l'appel API pour synchroniser avec le cloud
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Servers Inventory</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Server
            </Button>
            <Button variant="outline" onClick={() => setShowSyncForm(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync with Cloud
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-medium">
                      <Link to={`/inventory/servers/${server.id}`} className="hover:underline text-blue-600">
                        {server.name}
                      </Link>
                    </TableCell>
                    <TableCell>{server.ip}</TableCell>
                    <TableCell>{server.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {server.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Cloud className="h-3 w-3 mr-1" />
                        {server.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/inventory/servers/${server.id}`}>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire d'ajout de serveur */}
      {showAddForm && (
        <AddServerForm 
          onClose={() => setShowAddForm(false)} 
          onSubmit={addServer}
        />
      )}

      {/* Formulaire de synchronisation cloud */}
      {showSyncForm && (
        <SyncCloudForm 
          onClose={() => setShowSyncForm(false)} 
          onSubmit={syncWithCloud}
        />
      )}
    </MainLayout>
  );
};

export default Inventory;
