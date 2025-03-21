
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Sample data generators
const generateHostData = () => [
  {
    id: "host-1",
    name: "Production Server 1",
    status: "online",
    uptime: "45d 12h 37m",
    cpu: 42,
    memory: 65,
    disk: 78,
    network: "1.2 GB/s",
    load: "3.2, 2.8, 2.4",
  },
  {
    id: "host-2",
    name: "Production Server 2",
    status: "online",
    uptime: "30d 5h 12m",
    cpu: 38,
    memory: 52,
    disk: 45,
    network: "824 MB/s",
    load: "2.1, 1.9, 1.7",
  },
  {
    id: "host-3",
    name: "Development Server",
    status: "online",
    uptime: "15d 22h 45m",
    cpu: 12,
    memory: 35,
    disk: 30,
    network: "156 MB/s",
    load: "0.8, 0.7, 0.6",
  },
  {
    id: "host-4",
    name: "Staging Server",
    status: "online",
    uptime: "60d 3h 15m",
    cpu: 25,
    memory: 40,
    disk: 55,
    network: "310 MB/s",
    load: "1.5, 1.2, 0.9",
  },
];

const generateContainerData = () => [
  {
    id: "container-1",
    name: "web-frontend",
    host: "Production Server 1",
    status: "running",
    uptime: "12d 5h 30m",
    cpu: 22,
    memory: 512,
    memoryPercent: 35,
    network: "120 MB/s",
    restarts: 0,
  },
  {
    id: "container-2",
    name: "api-backend",
    host: "Production Server 1",
    status: "running",
    uptime: "12d 5h 30m",
    cpu: 35,
    memory: 768,
    memoryPercent: 42,
    network: "85 MB/s",
    restarts: 1,
  },
  {
    id: "container-3",
    name: "redis-cache",
    host: "Production Server 2",
    status: "running",
    uptime: "30d 2h 15m",
    cpu: 15,
    memory: 256,
    memoryPercent: 28,
    network: "45 MB/s",
    restarts: 0,
  },
  {
    id: "container-4",
    name: "postgres-db",
    host: "Production Server 2",
    status: "running",
    uptime: "30d 2h 15m",
    cpu: 45,
    memory: 1024,
    memoryPercent: 65,
    network: "72 MB/s",
    restarts: 0,
  },
  {
    id: "container-5",
    name: "nginx-proxy",
    host: "Production Server 1",
    status: "running",
    uptime: "12d 5h 30m",
    cpu: 12,
    memory: 128,
    memoryPercent: 18,
    network: "210 MB/s",
    restarts: 0,
  },
];

interface MetricsTableProps {
  type: "host" | "container";
  hostId?: string;
}

export const MetricsTable = ({ type, hostId }: MetricsTableProps) => {
  // Generate and filter data based on the type and hostId
  let data: any[] = [];
  
  if (type === "host") {
    data = generateHostData();
    if (hostId && hostId !== "all") {
      data = data.filter(host => host.id === hostId);
    }
  } else {
    data = generateContainerData();
    if (hostId && hostId !== "all") {
      // Filter containers by host
      const hostData = generateHostData().find(host => host.id === hostId);
      data = data.filter(container => container.host === hostData?.name);
    }
  }

  if (type === "host") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Host Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Disk</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Load Avg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((host) => (
              <TableRow key={host.id}>
                <TableCell className="font-medium">{host.name}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    {host.status}
                  </span>
                </TableCell>
                <TableCell>{host.uptime}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={host.cpu} className="w-16" />
                    <span>{host.cpu}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={host.memory} className="w-16" />
                    <span>{host.memory}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={host.disk} className="w-16" />
                    <span>{host.disk}%</span>
                  </div>
                </TableCell>
                <TableCell>{host.network}</TableCell>
                <TableCell>{host.load}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Container Name</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead>CPU</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Restarts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((container) => (
            <TableRow key={container.id}>
              <TableCell className="font-medium">{container.name}</TableCell>
              <TableCell>{container.host}</TableCell>
              <TableCell>
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  {container.status}
                </span>
              </TableCell>
              <TableCell>{container.uptime}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={container.cpu} className="w-16" />
                  <span>{container.cpu}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={container.memoryPercent} className="w-16" />
                  <span>{container.memory} MB</span>
                </div>
              </TableCell>
              <TableCell>{container.network}</TableCell>
              <TableCell>{container.restarts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
