
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/metrics/DateRangePicker";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsFilter } from "@/components/logs/LogsFilter";
import { RefreshCcw, Download, FileDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data - in a real app, this would come from an API
const hosts = [
  { id: "host-1", name: "Production Server 1" },
  { id: "host-2", name: "Production Server 2" },
  { id: "host-3", name: "Development Server" },
  { id: "host-4", name: "Staging Server" },
];

const Logs = () => {
  const [selectedHost, setSelectedHost] = useState<string>("all");
  const [viewType, setViewType] = useState<"system" | "container" | "security">("system");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleRefresh = () => {
    // In a real app, this would refresh the logs data
    console.log("Refreshing logs data");
  };

  const handleExport = () => {
    // In a real app, this would export the logs data
    console.log("Exporting logs data");
  };

  return (
    <MainLayout>
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
              <LogsFilter logType={viewType} />
            </CardContent>
          </Card>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>System and host logs</CardDescription>
              </CardHeader>
              <CardContent>
                <LogsTable 
                  type="system" 
                  hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  searchQuery={searchQuery}
                />
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
                <LogsTable 
                  type="container" 
                  hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  searchQuery={searchQuery}
                />
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
                <LogsTable 
                  type="security" 
                  hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  searchQuery={searchQuery}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Logs;
