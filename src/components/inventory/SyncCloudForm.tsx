
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SyncCloudFormProps {
  onClose: () => void;
  onSubmit: (provider: string) => void;
}

const SyncCloudForm: React.FC<SyncCloudFormProps> = ({ onClose, onSubmit }) => {
  const cloudProviders = [
    { id: "aws", name: "Amazon Web Services", logo: "AWS" },
    { id: "gcp", name: "Google Cloud Platform", logo: "GCP" },
    { id: "azure", name: "Microsoft Azure", logo: "Azure" },
    { id: "digitalocean", name: "DigitalOcean", logo: "DO" },
    { id: "linode", name: "Linode", logo: "Linode" },
  ];

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex items-center justify-between">
          <SheetTitle>Sync with Cloud Provider</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a cloud provider to synchronize your servers. This will import all your instances from the selected provider.
          </p>
          
          <div className="grid gap-4">
            {cloudProviders.map((provider) => (
              <Card 
                key={provider.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onSubmit(provider.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Cloud className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Import servers from {provider.name}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SyncCloudForm;
