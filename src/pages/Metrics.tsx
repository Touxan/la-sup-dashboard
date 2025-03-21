
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsChart } from "@/components/metrics/MetricsChart";
import { MetricsTable } from "@/components/metrics/MetricsTable";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/metrics/DateRangePicker";
import { RefreshCcw, Download } from "lucide-react";

// Sample data - in a real app, this would come from an API
const hosts = [
  { id: "host-1", name: "Production Server 1" },
  { id: "host-2", name: "Production Server 2" },
  { id: "host-3", name: "Development Server" },
  { id: "host-4", name: "Staging Server" },
];

const Metrics = () => {
  const [selectedHost, setSelectedHost] = useState<string>("all");
  const [viewType, setViewType] = useState<"hosts" | "containers">("hosts");

  const handleRefresh = () => {
    // In a real app, this would refresh the metrics data
    console.log("Refreshing metrics data");
  };

  const handleExport = () => {
    // In a real app, this would export the metrics data
    console.log("Exporting metrics data");
  };

  return (
    <MainLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
            <p className="text-muted-foreground">
              Monitor performance metrics for your infrastructure
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateRangePicker />
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hosts" className="space-y-4" onValueChange={(value) => setViewType(value as "hosts" | "containers")}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="hosts">Hosts</TabsTrigger>
              <TabsTrigger value="containers">Containers</TabsTrigger>
            </TabsList>
            
            <Select value={selectedHost} onValueChange={setSelectedHost}>
              <SelectTrigger className="w-[220px]">
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

          <TabsContent value="hosts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                title="CPU Usage" 
                value="42%" 
                description="Average across all hosts" 
                trend="up" 
                trendValue="+5.2%" 
              />
              <MetricCard 
                title="Memory Usage" 
                value="7.2 GB" 
                description="Total allocated" 
                trend="neutral" 
                trendValue="-0.1%" 
              />
              <MetricCard 
                title="Disk I/O" 
                value="245 MB/s" 
                description="Read/write operations" 
                trend="up" 
                trendValue="+14.3%" 
              />
              <MetricCard 
                title="Network Traffic" 
                value="1.4 GB/s" 
                description="Inbound/outbound" 
                trend="down" 
                trendValue="-3.7%" 
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>CPU Utilization</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="line" 
                    metricType="cpu" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="line" 
                    metricType="memory" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Disk Usage</CardTitle>
                  <CardDescription>By partition</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="bar" 
                    metricType="disk" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Network Traffic</CardTitle>
                  <CardDescription>Inbound/Outbound</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="area" 
                    metricType="network" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Host Metrics Table</CardTitle>
                <CardDescription>Detailed metrics for all hosts</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsTable hostId={selectedHost !== "all" ? selectedHost : undefined} type="host" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                title="Container Count" 
                value="32" 
                description="Active containers" 
                trend="up" 
                trendValue="+3" 
              />
              <MetricCard 
                title="Container CPU" 
                value="37%" 
                description="Average utilization" 
                trend="down" 
                trendValue="-2.3%" 
              />
              <MetricCard 
                title="Container Memory" 
                value="5.4 GB" 
                description="Total allocated" 
                trend="up" 
                trendValue="+0.8%" 
              />
              <MetricCard 
                title="Restart Count" 
                value="5" 
                description="Last 24 hours" 
                trend="down" 
                trendValue="-2" 
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Container CPU Usage</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="line" 
                    metricType="container-cpu" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Container Memory Usage</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <MetricsChart 
                    type="line" 
                    metricType="container-memory" 
                    hostId={selectedHost !== "all" ? selectedHost : undefined} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Container Metrics Table</CardTitle>
                <CardDescription>Detailed metrics for all containers</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsTable hostId={selectedHost !== "all" ? selectedHost : undefined} type="container" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue 
}: { 
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <p className={`text-xs mt-2 ${
          trend === "up" ? "text-emerald-500" : 
          trend === "down" ? "text-amber-500" : 
          "text-muted-foreground"
        }`}>
          {trendValue}
        </p>
      </CardContent>
    </Card>
  );
};

export default Metrics;
