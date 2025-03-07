
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface AddServerFormProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    ip: string;
    description: string;
    tags: string[];
    provider: string;
  }) => void;
}

const AddServerForm: React.FC<AddServerFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    description: "",
    tags: "",
    provider: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      ip: formData.ip,
      description: formData.description,
      tags: formData.tags.split(",").map(tag => tag.trim()),
      provider: formData.provider,
    });
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex items-center justify-between">
          <SheetTitle>Add New Server</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter server name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ip">IP Address</Label>
            <Input
              id="ip"
              name="ip"
              placeholder="192.168.1.1"
              value={formData.ip}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Server description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="production, web, database"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provider">Cloud Provider</Label>
            <Input
              id="provider"
              name="provider"
              placeholder="AWS, GCP, Azure, etc."
              value={formData.provider}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Server
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddServerForm;
