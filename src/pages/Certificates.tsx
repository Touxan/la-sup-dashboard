
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Shield, Globe, X, RefreshCw } from "lucide-react";

// Type for a certificate
interface Certificate {
  id: string;
  domain: string;
  expiryDate: Date;
  lastVerified: Date;
  status: "valid" | "expiring" | "expired";
}

const Certificates = () => {
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState("");
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      domain: "example.com",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lastVerified: new Date(),
      status: "valid",
    },
    {
      id: "2",
      domain: "test.example.com",
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      lastVerified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days in the past
      status: "expiring",
    },
    {
      id: "3",
      domain: "expired.example.com",
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days in the past
      lastVerified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days in the past
      status: "expired",
    },
  ]);

  const handleAddDomain = () => {
    if (!newDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    if (certificates.some(cert => cert.domain === newDomain)) {
      toast({
        title: "Error",
        description: "This domain name already exists",
        variant: "destructive",
      });
      return;
    }

    const newCertificate: Certificate = {
      id: Math.random().toString(36).substring(7),
      domain: newDomain,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      lastVerified: new Date(),
      status: "valid",
    };

    setCertificates([...certificates, newCertificate]);
    setNewDomain("");
    toast({
      title: "Success",
      description: `Domain ${newDomain} has been added`,
    });
  };

  const handleDeleteDomain = (id: string) => {
    const certToDelete = certificates.find(cert => cert.id === id);
    setCertificates(certificates.filter(cert => cert.id !== id));
    toast({
      title: "Domain deleted",
      description: `Certificate for ${certToDelete?.domain} has been deleted`,
    });
  };

  const handleVerifyExpiration = (id: string) => {
    setCertificates(certificates.map(cert => {
      if (cert.id === id) {
        // Simulate a verification that updates the last verification date
        return {
          ...cert,
          lastVerified: new Date()
        };
      }
      return cert;
    }));

    const cert = certificates.find(c => c.id === id);
    toast({
      title: "Verification complete",
      description: `Certificate for ${cert?.domain} has been verified`,
    });
  };

  const getStatusColor = (status: Certificate["status"]) => {
    switch (status) {
      case "valid":
        return "text-green-600";
      case "expiring":
        return "text-yellow-600";
      case "expired":
        return "text-red-600";
      default:
        return "";
    }
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">SSL Certificates</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Add a Domain Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <Button onClick={handleAddDomain}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Last Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> 
                        {cert.domain}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(cert.expiryDate)}</TableCell>
                    <TableCell>{formatDate(cert.lastVerified)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${getStatusColor(cert.status)}`}>
                        <Shield className="h-4 w-4" />
                        {cert.status === "valid" && "Valid"}
                        {cert.status === "expiring" && "Expiring Soon"}
                        {cert.status === "expired" && "Expired"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyExpiration(cert.id)}
                          title="Verify Expiration"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteDomain(cert.id)}
                          title="Delete"
                        >
                          <X className="h-4 w-4" />
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

export default Certificates;
