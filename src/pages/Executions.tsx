
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Function to fetch successful executions
const fetchSuccessfulExecutions = async (): Promise<Execution[]> => {
  try {
    const response = await fetch("http://localhost:5678/webhook/e285d121-b78b-4dcd-8da9-4d4a97945fb6");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch successful executions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching successful executions:", error);
    toast({
      title: "Error fetching successful executions",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};

// Function to fetch failed executions
const fetchFailedExecutions = async (): Promise<Execution[]> => {
  try {
    const response = await fetch("http://localhost:5678/webhook/4beee460-62b8-4805-af2c-c5bad8c1bc21");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch failed executions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching failed executions:", error);
    toast({
      title: "Error fetching failed executions",
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

// ExecutionTable component for reusability
const ExecutionTable = ({ executions }: { executions: Execution[] }) => (
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
        {executions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No executions found
            </TableCell>
          </TableRow>
        ) : (
          executions.map((execution) => (
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
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

const Executions = () => {
  // Query for successful executions
  const { 
    data: successfulExecutions, 
    isLoading: isLoadingSuccessful, 
    error: errorSuccessful, 
    refetch: refetchSuccessful 
  } = useQuery({
    queryKey: ["successful-executions"],
    queryFn: fetchSuccessfulExecutions,
  });

  // Query for failed executions
  const { 
    data: failedExecutions, 
    isLoading: isLoadingFailed, 
    error: errorFailed,
    refetch: refetchFailed 
  } = useQuery({
    queryKey: ["failed-executions"],
    queryFn: fetchFailedExecutions,
  });

  const isLoading = isLoadingSuccessful || isLoadingFailed;
  const hasError = errorSuccessful || errorFailed;

  const refreshAll = () => {
    refetchSuccessful();
    refetchFailed();
  };

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
              <Button size="sm" onClick={refreshAll}>
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
            
            {hasError && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error Loading Executions</CardTitle>
                  <CardDescription>
                    There was a problem fetching the execution data. Please ensure the API server is running.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make sure the endpoints at http://localhost:5678 are accessible.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {!isLoading && !hasError && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="failed" className="flex items-center gap-2">
                    Failed <Badge variant="secondary" className="ml-1">{failedExecutions?.length || 0}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="successful" className="flex items-center gap-2">
                    Successful <Badge variant="secondary" className="ml-1">{successfulExecutions?.length || 0}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-6 mt-6">
                  {/* Failed Executions Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-amber-700" />
                        Failed Executions
                      </CardTitle>
                      <CardDescription>
                        Showing the latest failed workflow executions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExecutionTable executions={failedExecutions || []} />
                    </CardContent>
                  </Card>

                  {/* Successful Executions Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-700" />
                        Successful Executions
                      </CardTitle>
                      <CardDescription>
                        Showing the latest successful workflow executions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExecutionTable executions={successfulExecutions || []} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="failed" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-amber-700" />
                        Failed Executions
                      </CardTitle>
                      <CardDescription>
                        Showing the latest failed workflow executions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExecutionTable executions={failedExecutions || []} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="successful" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-700" />
                        Successful Executions
                      </CardTitle>
                      <CardDescription>
                        Showing the latest successful workflow executions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExecutionTable executions={successfulExecutions || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </MainLayout>
      </div>
    </SidebarProvider>
  );
};

export default Executions;
