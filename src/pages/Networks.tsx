
import React, { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Tag, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Network {
  id: string;
  name: string;
  cidr: string;
  region: string;
  provider: string;
  tags: string[];
  status: "active" | "pending" | "inactive";
}

const Networks = () => {
  const [networks, setNetworks] = useState<Network[]>([
    {
      id: "net-1",
      name: "Production VPC",
      cidr: "10.0.0.0/16",
      region: "us-east-1",
      provider: "AWS",
      tags: ["production", "vpc"],
      status: "active",
    },
    {
      id: "net-2",
      name: "Development VPC",
      cidr: "10.1.0.0/16",
      region: "us-east-1",
      provider: "AWS",
      tags: ["development", "vpc"],
      status: "active",
    },
    {
      id: "net-3",
      name: "GCP Network",
      cidr: "192.168.0.0/20",
      region: "us-central1",
      provider: "GCP",
      tags: ["staging", "shared"],
      status: "active",
    },
    {
      id: "net-4",
      name: "Azure VNET",
      cidr: "172.16.0.0/16",
      region: "eastus",
      provider: "Azure",
      tags: ["production", "vnet"],
      status: "pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleRefresh = () => {
    toast.success("Networks refreshed successfully");
  };

  const filteredNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      network.cidr.includes(searchTerm) ||
      network.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Networks Inventory</h1>
          <div className="flex gap-3">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Network
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Networks</CardTitle>
              <div className="w-64 relative">
                <Input
                  placeholder="Search networks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CIDR</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNetworks.map((network) => (
                  <TableRow key={network.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/inventory/networks/${network.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {network.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">
                        {network.cidr}
                      </code>
                    </TableCell>
                    <TableCell>{network.region}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Cloud className="h-3 w-3 mr-1" />
                        {network.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {network.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          network.status === "active"
                            ? "default"
                            : network.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {network.status}
                      </Badge>
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

export default Networks;
