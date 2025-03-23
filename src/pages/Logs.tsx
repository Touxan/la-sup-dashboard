
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/metrics/DateRangePicker";
import { RefreshCcw, FileDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data - in a real app, this would come from an API
const hosts = [
  { id: "host-1", name: "Production Server 1" },
  { id: "host-2", name: "Production Server 2" },
  { id: "host-3", name: "Development Server" },
  { id: "host-4", name: "Staging Server" },
];

// Sample logs data
const generateSampleLogs = (type: string, count: number = 15) => {
  const severities = ["info", "warning", "error", "critical"];
  const sources = ["system", "application", "security", "network"];
  const messages = [
    "Server started",
    "Connection attempt failed",
    "User login successful",
    "Authentication failed",
    "Resource exhausted",
    "Service unavailable",
    "File not found",
    "Permission denied",
    "Configuration changed",
    "Memory limit reached"
  ];

  return Array(count).fill(0).map((_, i) => ({
    id: `log-${type}-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    hostId: hosts[Math.floor(Math.random() * hosts.length)].id
  }));
};

// Helper function to convert severity to Badge variant
const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "error": return "destructive";
    case "warning": return "outline"; // Changed from "warning" to "outline"
    case "critical": return "destructive";
    case "info": return "secondary";
    default: return "secondary";
  }
};

const Logs = () => {
  const [selectedHost, setSelectedHost] = useState<string>("all");
  const [viewType, setViewType] = useState<"system" | "container" | "security">("system");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);

  const handleRefresh = () => {
    // In a real app, this would refresh the logs data
    console.log("Refreshing logs data");
  };

  const handleExport = () => {
    // In a real app, this would export the logs data
    console.log("Exporting logs data");
  };

  // Generate logs for current view type
  const logs = generateSampleLogs(viewType);

  // Filter logs based on selected host and search query
  const filteredLogs = logs.filter(log => {
    // Filter by host
    if (selectedHost !== "all" && log.hostId !== selectedHost) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by severity if any selected
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(log.severity)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">
            Monitor and analyze logs from your infrastructure
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker />
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-4" onValueChange={(value) => setViewType(value as "system" | "container" | "security")}>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="system">System Logs</TabsTrigger>
            <TabsTrigger value="container">Container Logs</TabsTrigger>
            <TabsTrigger value="security">Security Logs</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8 max-w-[180px] sm:max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedHost} onValueChange={setSelectedHost}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by host" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hosts</SelectItem>
                {hosts.map((host) => (
                  <SelectItem key={host.id} value={host.id}>
                    {host.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle>Log Filters</CardTitle>
            <CardDescription>Filter logs by severity, source, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["info", "warning", "error", "critical"].map(severity => (
                <Badge 
                  key={severity}
                  variant={getSeverityVariant(severity)}
                  className={`cursor-pointer ${selectedSeverities.includes(severity) ? 'opacity-100' : 'opacity-50'}`}
                  onClick={() => {
                    if (selectedSeverities.includes(severity)) {
                      setSelectedSeverities(selectedSeverities.filter(s => s !== severity));
                    } else {
                      setSelectedSeverities([...selectedSeverities, severity]);
                    }
                  }}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>System and host logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[45%]">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No logs found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="container" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Logs</CardTitle>
              <CardDescription>Logs from containers and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[45%]">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No logs found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Security audit and event logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[45%]">Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No logs found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Logs;
