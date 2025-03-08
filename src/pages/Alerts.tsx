
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { PlusCircle, AlertTriangle, Bell, Activity, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Types for alerts
interface BaseAlert {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  evaluationPeriod: number; // in minutes
  lastEvaluatedAt: Date;
}

interface MetricAlert extends BaseAlert {
  type: "metric";
  metricName: string;
  threshold: number;
  operator: ">" | "<" | "==" | ">=" | "<=";
}

interface LogAlert extends BaseAlert {
  type: "log";
  pattern: string;
  severity: "low" | "medium" | "high" | "critical";
}

type Alert = MetricAlert | LogAlert;

const Alerts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"metrics" | "logs">("metrics");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      name: "High CPU Usage",
      description: "Alert when CPU usage exceeds 90%",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      evaluationPeriod: 5,
      lastEvaluatedAt: new Date(Date.now() - 15 * 60 * 1000),
      type: "metric",
      metricName: "cpu_usage",
      threshold: 90,
      operator: ">"
    },
    {
      id: "2",
      name: "Memory Usage Warning",
      description: "Alert when memory usage exceeds 80%",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      evaluationPeriod: 10,
      lastEvaluatedAt: new Date(Date.now() - 5 * 60 * 1000),
      type: "metric",
      metricName: "memory_usage",
      threshold: 80,
      operator: ">"
    },
    {
      id: "3",
      name: "Error Log Detection",
      description: "Alert when error logs are detected",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      evaluationPeriod: 15,
      lastEvaluatedAt: new Date(Date.now() - 10 * 60 * 1000),
      type: "log",
      pattern: "ERROR",
      severity: "high"
    },
    {
      id: "4",
      name: "Critical Log Detection",
      description: "Alert when critical failures are logged",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      evaluationPeriod: 3,
      lastEvaluatedAt: new Date(Date.now() - 3 * 60 * 1000),
      type: "log",
      pattern: "CRITICAL",
      severity: "critical"
    }
  ]);
  
  // Form states for the new alert dialog
  const [newAlertName, setNewAlertName] = useState("");
  const [newAlertDescription, setNewAlertDescription] = useState("");
  const [newAlertEvaluationPeriod, setNewAlertEvaluationPeriod] = useState(5);
  const [newAlertType, setNewAlertType] = useState<"metric" | "log">("metric");
  
  // Metric alert fields
  const [newAlertMetricName, setNewAlertMetricName] = useState("");
  const [newAlertThreshold, setNewAlertThreshold] = useState(0);
  const [newAlertOperator, setNewAlertOperator] = useState<">" | "<" | "==" | ">=" | "<=">("");
  
  // Log alert fields
  const [newAlertPattern, setNewAlertPattern] = useState("");
  const [newAlertSeverity, setNewAlertSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  
  const resetForm = () => {
    setNewAlertName("");
    setNewAlertDescription("");
    setNewAlertEvaluationPeriod(5);
    setNewAlertType("metric");
    setNewAlertMetricName("");
    setNewAlertThreshold(0);
    setNewAlertOperator(">");
    setNewAlertPattern("");
    setNewAlertSeverity("medium");
  };

  const handleCreateAlert = () => {
    if (!newAlertName) {
      toast({
        title: "Error",
        description: "Alert name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const baseAlert: BaseAlert = {
      id: Math.random().toString(36).substring(7),
      name: newAlertName,
      description: newAlertDescription,
      createdAt: new Date(),
      evaluationPeriod: newAlertEvaluationPeriod,
      lastEvaluatedAt: new Date(),
    };

    let newAlert: Alert;

    if (newAlertType === "metric") {
      if (!newAlertMetricName || !newAlertOperator) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      newAlert = {
        ...baseAlert,
        type: "metric",
        metricName: newAlertMetricName,
        threshold: newAlertThreshold,
        operator: newAlertOperator,
      };
    } else {
      if (!newAlertPattern) {
        toast({
          title: "Error",
          description: "Pattern cannot be empty",
          variant: "destructive",
        });
        return;
      }

      newAlert = {
        ...baseAlert,
        type: "log",
        pattern: newAlertPattern,
        severity: newAlertSeverity,
      };
    }

    setAlerts([...alerts, newAlert]);
    resetForm();

    toast({
      title: "Alert created",
      description: `Alert "${newAlertName}" has been created successfully.`,
    });
  };

  const handleDeleteAlert = (id: string) => {
    const alertToDelete = alerts.find(alert => alert.id === id);
    setAlerts(alerts.filter(alert => alert.id !== id));
    
    toast({
      title: "Alert deleted",
      description: `Alert "${alertToDelete?.name}" has been deleted.`,
    });
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Monitoring Alerts</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Configure the settings for your new alert.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={newAlertType === "metric" ? "default" : "outline"}
                      onClick={() => setNewAlertType("metric")}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Metric Alert
                    </Button>
                    <Button
                      type="button"
                      variant={newAlertType === "log" ? "default" : "outline"}
                      onClick={() => setNewAlertType("log")}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Log Alert
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Alert Name</Label>
                      <Input
                        id="name"
                        value={newAlertName}
                        onChange={(e) => setNewAlertName(e.target.value)}
                        placeholder="CPU High Usage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evaluation-period">Evaluation Period (minutes)</Label>
                      <Input
                        id="evaluation-period"
                        type="number"
                        min={1}
                        value={newAlertEvaluationPeriod}
                        onChange={(e) => setNewAlertEvaluationPeriod(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newAlertDescription}
                      onChange={(e) => setNewAlertDescription(e.target.value)}
                      placeholder="Alert when CPU usage is high"
                    />
                  </div>
                  
                  {newAlertType === "metric" ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="metric-name">Metric Name</Label>
                        <Input
                          id="metric-name"
                          value={newAlertMetricName}
                          onChange={(e) => setNewAlertMetricName(e.target.value)}
                          placeholder="cpu_usage"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="operator">Operator</Label>
                        <select
                          id="operator"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newAlertOperator}
                          onChange={(e) => setNewAlertOperator(e.target.value as any)}
                        >
                          <option value="">Select operator</option>
                          <option value=">">Greater than (&gt;)</option>
                          <option value="<">Less than (&lt;)</option>
                          <option value="==">Equal to (==)</option>
                          <option value=">=">Greater than or equal (&gt;=)</option>
                          <option value="<=">Less than or equal (&lt;=)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="threshold">Threshold</Label>
                        <Input
                          id="threshold"
                          type="number"
                          value={newAlertThreshold}
                          onChange={(e) => setNewAlertThreshold(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pattern">Log Pattern</Label>
                        <Input
                          id="pattern"
                          value={newAlertPattern}
                          onChange={(e) => setNewAlertPattern(e.target.value)}
                          placeholder="ERROR"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <select
                          id="severity"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newAlertSeverity}
                          onChange={(e) => setNewAlertSeverity(e.target.value as any)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateAlert}>Create Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Alert Management</CardTitle>
            <CardDescription>
              Monitor your infrastructure with metrics and log alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics" onValueChange={(value) => setActiveTab(value as "metrics" | "logs")}>
              <TabsList className="mb-4">
                <TabsTrigger value="metrics">
                  <Activity className="mr-2 h-4 w-4" />
                  Metrics Alerts
                </TabsTrigger>
                <TabsTrigger value="logs">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Logs Alerts
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Metric & Condition</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Evaluation Period</TableHead>
                      <TableHead>Last Evaluated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.filter(alert => alert.type === "metric").map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            {alert.name}
                          </div>
                        </TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>
                          {(alert as MetricAlert).metricName} {(alert as MetricAlert).operator} {(alert as MetricAlert).threshold}
                        </TableCell>
                        <TableCell>{formatDate(alert.createdAt)}</TableCell>
                        <TableCell>{alert.evaluationPeriod} min</TableCell>
                        <TableCell>{formatDate(alert.lastEvaluatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="logs">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Pattern</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Evaluation Period</TableHead>
                      <TableHead>Last Evaluated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.filter(alert => alert.type === "log").map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-blue-500" />
                            {alert.name}
                          </div>
                        </TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell><code className="bg-gray-100 px-1 py-0.5 rounded">{(alert as LogAlert).pattern}</code></TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${(alert as LogAlert).severity === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                            ${(alert as LogAlert).severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${(alert as LogAlert).severity === 'high' ? 'bg-orange-100 text-orange-800' : ''}
                            ${(alert as LogAlert).severity === 'critical' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {(alert as LogAlert).severity}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(alert.createdAt)}</TableCell>
                        <TableCell>{alert.evaluationPeriod} min</TableCell>
                        <TableCell>{formatDate(alert.lastEvaluatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Alerts;
