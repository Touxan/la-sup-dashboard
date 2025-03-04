
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowUpDown,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

import MainLayout from "@/components/MainLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Execution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf: string | null;
  retrySuccessId: string | null;
  startedAt: string;
  stoppedAt: string;
  workflowId: string;
  waitTill: string | null;
}

// Function to fetch execution data
const fetchExecutions = async (): Promise<Execution[]> => {
  try {
    const response = await fetch("http://localhost:5678/webhook/e285d121-b78b-4dcd-8da9-4d4a97945fb6");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch executions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching executions:", error);
    toast({
      title: "Error fetching executions",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};

// Helper function to format execution mode for display
const formatExecutionMode = (mode: string): string => {
  switch (mode) {
    case 'webhook':
      return 'Webhook';
    case 'manual':
      return 'Manual';
    case 'trigger':
      return 'Scheduled';
    default:
      return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
};

// Helper function to get the execution duration
const getExecutionDuration = (startedAt: string, stoppedAt: string): string => {
  const start = new Date(startedAt);
  const stop = new Date(stoppedAt);
  const durationMs = stop.getTime() - start.getTime();
  
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else {
    return `${(durationMs / 1000).toFixed(2)}s`;
  }
};

const Executions = () => {
  const { data: executions, isLoading, error, refetch } = useQuery({
    queryKey: ["executions"],
    queryFn: fetchExecutions,
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainLayout>
          <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Automation</span>
                <h1 className="text-3xl font-semibold tracking-tight">Executions</h1>
              </div>
              <Button size="sm" onClick={() => refetch()}>
                Refresh
              </Button>
            </div>
            
            {isLoading && (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[400px] w-full" />
                </CardContent>
              </Card>
            )}
            
            {error && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error Loading Executions</CardTitle>
                  <CardDescription>
                    There was a problem fetching the execution data. Please ensure the API server is running.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make sure the endpoint at http://localhost:5678/webhook/e285d121-b78b-4dcd-8da9-4d4a97945fb6 is accessible.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {!isLoading && executions && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workflow Executions</CardTitle>
                  <CardDescription>
                    Showing the last {executions.length} workflow executions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Workflow ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {executions.map((execution) => (
                          <TableRow key={execution.id}>
                            <TableCell className="font-medium">{execution.id}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help font-mono text-xs">
                                      {execution.workflowId.slice(0, 8)}...
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{execution.workflowId}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {execution.finished ? (
                                <Badge 
                                  variant="outline" 
                                  className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Completed
                                </Badge>
                              ) : (
                                <Badge 
                                  variant="outline" 
                                  className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Failed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {formatExecutionMode(execution.mode)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(execution.startedAt), "MMM d, yyyy")}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(execution.startedAt), "h:mm:ss a")}
                                </span>
                                <span className="text-xs text-muted-foreground italic">
                                  {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getExecutionDuration(execution.startedAt, execution.stoppedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2"
                                onClick={() => window.open(`http://localhost:5678/workflow/${execution.workflowId}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </MainLayout>
      </div>
    </SidebarProvider>
  );
};

export default Executions;
