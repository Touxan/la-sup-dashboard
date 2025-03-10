
import { useState } from "react";
import { 
  Play, 
  Square, 
  Tag, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for workflow templates
const mockTemplates = [
  {
    id: "1",
    name: "Server Backup",
    tags: ["backup", "scheduled"],
    lastExecution: "2023-10-15T08:30:00",
    status: "idle", // idle, running, success, failed
    trigger: "webhook",
  },
  {
    id: "2",
    name: "Security Scan",
    tags: ["security", "scan"],
    lastExecution: "2023-10-14T12:45:00",
    status: "idle",
    trigger: "form",
  },
  {
    id: "3",
    name: "Database Cleanup",
    tags: ["database", "maintenance"],
    lastExecution: "2023-10-13T22:10:00",
    status: "idle",
    trigger: "webhook",
  },
  {
    id: "4",
    name: "SSL Certificate Renewal",
    tags: ["ssl", "security"],
    lastExecution: "2023-10-10T16:20:00",
    status: "idle",
    trigger: "form",
  },
];

const Templates = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const { toast } = useToast();

  // Function to execute a workflow
  const executeWorkflow = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, status: "running" } 
          : template
      )
    );

    toast({
      title: "Workflow started",
      description: "The workflow execution has been initiated.",
    });

    // Simulate workflow completion after random time
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      setTemplates(prev => 
        prev.map(template => 
          template.id === id 
            ? { 
                ...template, 
                status: success ? "success" : "failed",
                lastExecution: new Date().toISOString()
              } 
            : template
        )
      );

      toast({
        title: success ? "Workflow completed" : "Workflow failed",
        description: success 
          ? "The workflow has been executed successfully." 
          : "The workflow execution failed. Check logs for details.",
        variant: success ? "default" : "destructive",
      });
    }, Math.random() * 5000 + 2000); // 2-7 seconds
  };

  // Function to stop a workflow
  const stopWorkflow = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, status: "failed" } 
          : template
      )
    );

    toast({
      title: "Workflow stopped",
      description: "The workflow execution has been stopped.",
      variant: "destructive",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Workflow Templates</h1>
            <p className="text-muted-foreground">Manage and execute your workflow templates</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              List of available workflow templates that can be triggered via webhook or form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Execution</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.trigger}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(template.lastExecution)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {template.status === "running" && (
                        <Badge className="bg-amber-500">Running</Badge>
                      )}
                      {template.status === "success" && (
                        <Badge className="bg-green-500 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      )}
                      {template.status === "failed" && (
                        <Badge className="bg-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                      {template.status === "idle" && (
                        <Badge variant="outline">Idle</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {template.status === "running" ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => stopWorkflow(template.id)}
                        >
                          <Square className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => executeWorkflow(template.id)}
                          disabled={template.status === "running"}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Execute
                        </Button>
                      )}
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

export default Templates;
