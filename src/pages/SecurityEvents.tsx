
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { 
  Shield, 
  AlertTriangle, 
  Terminal, 
  ClipboardList, 
  Activity, 
  BarChart3,
  Search,
  RefreshCcw,
  ServerCrash,
  Lock,
  Key,
  Bug,
  ShieldAlert
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Types for security events
interface SecurityEvent {
  id: string;
  timestamp: Date;
  severity: "critical" | "warning" | "informational" | "notice";
  source: string;
  description: string;
  rule?: string;
  eventType: "access" | "authentication" | "file" | "network" | "process" | "system";
  serverName: string;
  ip?: string;
}

// Mock data for the statistics
const priorityStats = [
  { name: "Critical", value: 1339, color: "#E53935" },
  { name: "Warning", value: 3741, color: "#FB8C00" },
  { name: "Informational", value: 8921, color: "#43A047" },
  { name: "Notice", value: 511, color: "#1E88E5" },
];

const ruleStats = [
  { name: "Executing binary not part of base image", value: 890, color: "#7B1FA2" },
  { name: "Sensitive file opened for reading by non-trusted program", value: 780, color: "#EF6C00" },
  { name: "Failed access attempt", value: 420, color: "#D32F2F" },
  { name: "Detected ptrace/PTRACE_ATTACH attempt", value: 330, color: "#689F38" },
  { name: "Malicious shell command execution", value: 290, color: "#0097A7" },
  { name: "Other", value: 1230, color: "#AFB42B" },
];

const sourceStats = [
  { name: "APT", value: 1250, color: "#1976D2" },
  { name: "Web Server", value: 980, color: "#E53935" },
  { name: "Database", value: 720, color: "#F9A825" },
  { name: "Auth Service", value: 680, color: "#43A047" },
  { name: "Container", value: 590, color: "#5E35B1" },
  { name: "API Gateway", value: 430, color: "#00897B" },
  { name: "Firewall", value: 380, color: "#FB8C00" },
  { name: "Load Balancer", value: 290, color: "#8D6E63" },
  { name: "DNS", value: 190, color: "#546E7A" },
  { name: "Other", value: 150, color: "#78909C" },
];

// Event rate data for the line chart
const eventRateData = [
  { time: "08:00", count: 0 },
  { time: "08:10", count: 0 },
  { time: "08:20", count: 0 },
  { time: "08:30", count: 0 },
  { time: "08:40", count: 210 },
  { time: "08:50", count: 0 },
  { time: "09:00", count: 0 },
  { time: "09:10", count: 5 },
  { time: "09:20", count: 0 },
  { time: "09:30", count: 0 },
  { time: "09:40", count: 0 },
  { time: "09:50", count: 0 },
  { time: "10:00", count: 180 },
  { time: "10:10", count: 0 },
  { time: "10:20", count: 0 },
  { time: "10:30", count: 15 },
];

// Mock security event logs
const mockEvents: SecurityEvent[] = [
  {
    id: "evt-001",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: "critical",
    source: "web-server-01",
    description: "Sensitive file opened for reading by non-trusted program /var/www/html/upload/malicious.php",
    rule: "Sensitive file opened for reading by non-trusted program",
    eventType: "file",
    serverName: "web-server-01",
    ip: "10.0.0.15"
  },
  {
    id: "evt-002",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    severity: "critical",
    source: "db-server-03",
    description: "Executing binary not part of base image: /tmp/.hidden/cryptominer",
    rule: "Executing binary not part of base image",
    eventType: "process",
    serverName: "db-server-03",
    ip: "10.0.0.23"
  },
  {
    id: "evt-003",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    severity: "warning",
    source: "auth-service",
    description: "Multiple failed login attempts for user admin from IP 185.173.35.12",
    rule: "Multiple failed login attempts",
    eventType: "authentication",
    serverName: "auth-server-01",
    ip: "185.173.35.12"
  },
  {
    id: "evt-004",
    timestamp: new Date(Date.now() - 37 * 60 * 1000),
    severity: "critical",
    source: "app-server-02",
    description: "Detected ptrace/PTRACE_ATTACH attempt on PID 3304 (nginx)",
    rule: "Detected ptrace/PTRACE_ATTACH attempt",
    eventType: "process",
    serverName: "app-server-02",
    ip: "10.0.0.17"
  },
  {
    id: "evt-005",
    timestamp: new Date(Date.now() - 42 * 60 * 1000),
    severity: "warning",
    source: "load-balancer-01",
    description: "Unusual traffic pattern detected: high volume of requests to /api/admin from IP block 91.234.55.0/24",
    rule: "Unusual traffic pattern",
    eventType: "network",
    serverName: "load-balancer-01",
    ip: "91.234.55.34"
  },
  {
    id: "evt-006",
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    severity: "informational",
    source: "container-registry",
    description: "New container image pushed: vulnerable/app:latest contains 3 critical vulnerabilities",
    rule: "Container image vulnerability",
    eventType: "system",
    serverName: "container-registry",
    ip: "10.0.0.30"
  },
  {
    id: "evt-007",
    timestamp: new Date(Date.now() - 67 * 60 * 1000),
    severity: "notice",
    source: "gateway-01",
    description: "API rate limit exceeded for client ID client_37842",
    rule: "API rate limit exceeded",
    eventType: "network",
    serverName: "gateway-01",
    ip: "10.0.0.5"
  },
  {
    id: "evt-008",
    timestamp: new Date(Date.now() - 75 * 60 * 1000),
    severity: "warning",
    source: "web-server-02",
    description: "SQL injection attempt detected in request parameter 'search'",
    rule: "SQL injection pattern",
    eventType: "network",
    serverName: "web-server-02",
    ip: "64.98.135.78"
  },
  {
    id: "evt-009",
    timestamp: new Date(Date.now() - 83 * 60 * 1000),
    severity: "critical",
    source: "storage-server-01",
    description: "Ransomware pattern detected: multiple files encrypted in short timeframe",
    rule: "Ransomware activity",
    eventType: "file",
    serverName: "storage-server-01",
    ip: "10.0.0.44"
  },
  {
    id: "evt-010",
    timestamp: new Date(Date.now() - 92 * 60 * 1000),
    severity: "informational",
    source: "auth-service",
    description: "User 'admin' accessed privileged resource /admin/config from new location",
    rule: "User access from new location",
    eventType: "authentication",
    serverName: "auth-server-01",
    ip: "109.237.103.54"
  }
];

const totalEvents = 14512;

const SecurityEvents = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<SecurityEvent[]>(mockEvents);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <ShieldAlert className="h-4 w-4 text-orange-500" />;
      case "informational":
        return <Activity className="h-4 w-4 text-green-500" />;
      case "notice":
        return <ClipboardList className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "access":
        return <Lock className="h-4 w-4" />;
      case "authentication":
        return <Key className="h-4 w-4" />;
      case "file":
        return <ClipboardList className="h-4 w-4" />;
      case "network":
        return <Activity className="h-4 w-4" />;
      case "process":
        return <Terminal className="h-4 w-4" />;
      case "system":
        return <ServerCrash className="h-4 w-4" />;
      default:
        return <Bug className="h-4 w-4" />;
    }
  };

  const COLORS = ["#E53935", "#FB8C00", "#43A047", "#1E88E5", "#7B1FA2"];

  const filteredEvents = events.filter(event => {
    if (severityFilter && event.severity !== severityFilter) {
      return false;
    }
    
    if (searchTerm) {
      return (
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.rule && event.rule.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return true;
  });

  const handleRefresh = () => {
    // In a real app, this would fetch new data
    setEvents([...mockEvents]);
    setSeverityFilter(null);
    setSearchTerm("");
  };

  const handleSeverityFilter = (severity: string | null) => {
    setSeverityFilter(severity === severityFilter ? null : severity);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-blue-600" />
            Security Events
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value as "overview" | "logs")}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Terminal className="mr-2 h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-green-500">{totalEvents}</CardTitle>
                  <CardDescription>Total Events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <span className="bg-red-500 rounded-full h-2 w-2 mr-1"></span>
                      <span>{priorityStats[0].value} Critical</span>
                    </span>
                    <span className="flex items-center">
                      <span className="bg-orange-500 rounded-full h-2 w-2 mr-1"></span>
                      <span>{priorityStats[1].value} Warning</span>
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Priorities</CardTitle>
                  <CardDescription>Distribution by severity</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {priorityStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                        labelFormatter={() => ''}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Rules</CardTitle>
                  <CardDescription>Top security rule triggers</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ruleStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ruleStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                        labelFormatter={() => ''}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Events Rate</CardTitle>
                  <CardDescription>Number of events over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eventRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#2E7D32" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sources</CardTitle>
                  <CardDescription>Distribution by source</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}`, name]}
                        labelFormatter={() => ''}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Security Event Logs</CardTitle>
                    <CardDescription>
                      Recent security events from all systems
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={severityFilter === "critical" ? "default" : "outline"}
                      onClick={() => handleSeverityFilter("critical")}
                      className={severityFilter === "critical" ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600"}
                    >
                      Critical
                    </Button>
                    <Button 
                      size="sm" 
                      variant={severityFilter === "warning" ? "default" : "outline"}
                      onClick={() => handleSeverityFilter("warning")}
                      className={severityFilter === "warning" ? "bg-orange-600 hover:bg-orange-700" : "border-orange-200 text-orange-600"}
                    >
                      Warning
                    </Button>
                    <Button 
                      size="sm" 
                      variant={severityFilter === "informational" ? "default" : "outline"}
                      onClick={() => handleSeverityFilter("informational")}
                      className={severityFilter === "informational" ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-600"}
                    >
                      Info
                    </Button>
                    <Button 
                      size="sm" 
                      variant={severityFilter === "notice" ? "default" : "outline"}
                      onClick={() => handleSeverityFilter("notice")}
                      className={severityFilter === "notice" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 text-blue-600"}
                    >
                      Notice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Server</TableHead>
                        <TableHead className="w-[300px]">Description</TableHead>
                        <TableHead>Rule</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-mono text-xs">
                              {formatDate(event.timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getSeverityIcon(event.severity)}
                                <span className={`capitalize ${
                                  event.severity === "critical" ? "text-red-600" :
                                  event.severity === "warning" ? "text-orange-600" :
                                  event.severity === "informational" ? "text-green-600" :
                                  "text-blue-600"
                                }`}>
                                  {event.severity}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getEventTypeIcon(event.eventType)}
                                <span className="capitalize">{event.eventType}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{event.serverName}</span>
                                {event.ip && <span className="text-xs text-muted-foreground">{event.ip}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate" title={event.description}>
                              {event.description}
                            </TableCell>
                            <TableCell>
                              {event.rule}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No events found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Log Event Details</CardTitle>
                  <CardDescription>
                    Raw event logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md overflow-auto h-64">
                    {filteredEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="whitespace-nowrap mb-1">
                        {`[${formatDate(event.timestamp)}] ${event.severity.toUpperCase()} ${event.eventType} ${event.serverName} ${event.ip || ''} - ${event.description}`}
                      </div>
                    ))}
                    {!filteredEvents.length && <div>No data</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SecurityEvents;
