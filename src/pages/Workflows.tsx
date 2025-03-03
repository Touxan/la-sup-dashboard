
import { useQuery } from "@tanstack/react-query";
import { 
  CalendarClock,
  Code2,
  ExternalLink,
  Play,
  StopCircle,
  Tag,
  Timer
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import MainLayout from "@/components/MainLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Node {
  parameters: Record<string, any>;
  type: string;
  typeVersion: number;
  position: [number, number];
  id: string;
  name: string;
  credentials?: Record<string, any>;
  webhookId?: string;
}

interface Connection {
  main: Array<Array<{
    node: string;
    type: string;
    index: number;
  }>>;
}

interface Connections {
  [key: string]: Connection;
}

interface Tag {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
}

interface Workflow {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  active: boolean;
  nodes: Node[];
  connections: Connections;
  settings: {
    executionOrder: string;
  };
  staticData: any;
  meta: any;
  pinData: Record<string, any>;
  versionId: string;
  triggerCount: number;
  tags: Tag[];
}

// Function to fetch workflow data
const fetchWorkflows = async (): Promise<Workflow[]> => {
  try {
    const response = await fetch("http://localhost:5678/webhook-test/673da098-0a03-42a1-ba35-c90ffc25a92c");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching workflows:", error);
    toast({
      title: "Error fetching workflows",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};

// Helper function to get node type display name
const getNodeTypeDisplay = (type: string): string => {
  const parts = type.split('.');
  return parts[parts.length - 1];
};

// Helper function to determine trigger type
const getTriggerType = (workflow: Workflow): string => {
  const triggerNode = workflow.nodes.find(node => 
    node.type.includes("Trigger") || 
    node.type.includes("webhook") ||
    node.name.includes("Trigger") ||
    node.name.includes("Webhook")
  );
  
  if (!triggerNode) return "Manual";
  
  if (triggerNode.type.includes("schedule") || triggerNode.name.includes("Schedule")) {
    return "Schedule";
  } else if (triggerNode.type.includes("webhook") || triggerNode.name.includes("Webhook")) {
    return "Webhook";
  } else {
    return "Manual";
  }
};

const Workflows = () => {
  const { data: workflows, isLoading, error } = useQuery({
    queryKey: ["workflows"],
    queryFn: fetchWorkflows,
  });

  const toggleWorkflowStatus = (id: string, currentStatus: boolean) => {
    // In a real app, this would make an API call to toggle the status
    toast({
      title: `Workflow ${currentStatus ? "deactivated" : "activated"}`,
      description: `Workflow status would be updated on the server`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainLayout>
          <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Automation</span>
                <h1 className="text-3xl font-semibold tracking-tight">Workflows</h1>
              </div>
              <Button size="sm">
                <Code2 className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
            
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-2" />
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {error && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error Loading Workflows</CardTitle>
                  <CardDescription>
                    There was a problem fetching the workflow data. Please ensure the API server is running.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make sure the endpoint at http://localhost:5678/webhook-test/673da098-0a03-42a1-ba35-c90ffc25a92c is accessible.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {!isLoading && workflows && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="border shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium truncate" title={workflow.name}>
                          {workflow.name}
                        </CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={workflow.active ? "outline" : "outline"}
                                size="icon"
                                className={`h-8 w-8 ${workflow.active ? "text-green-500 border-green-200" : "text-gray-400 border-gray-200"}`}
                                onClick={() => toggleWorkflowStatus(workflow.id, workflow.active)}
                              >
                                {workflow.active ? <Play className="h-4 w-4" /> : <StopCircle className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {workflow.active ? "Deactivate workflow" : "Activate workflow"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <CalendarClock className="h-3 w-3" />
                        Last updated: {format(new Date(workflow.updatedAt), "PPp")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Trigger</div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="flex items-center gap-1"
                            >
                              <Timer className="h-3 w-3" />
                              {getTriggerType(workflow)}
                            </Badge>
                            {workflow.triggerCount > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {workflow.triggerCount} {workflow.triggerCount === 1 ? 'execution' : 'executions'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Nodes ({workflow.nodes.length})</div>
                          <div className="flex flex-wrap gap-2">
                            {workflow.nodes.slice(0, 3).map((node) => (
                              <Badge 
                                key={node.id} 
                                variant="outline" 
                                className="text-xs"
                                title={node.type}
                              >
                                {node.name || getNodeTypeDisplay(node.type)}
                              </Badge>
                            ))}
                            {workflow.nodes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{workflow.nodes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {workflow.tags && workflow.tags.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Tags
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {workflow.tags.map((tag) => (
                                <Badge 
                                  key={tag.id} 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/automation/workflows/${workflow.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </MainLayout>
      </div>
    </SidebarProvider>
  );
};

export default Workflows;
