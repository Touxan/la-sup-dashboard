
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data generators
const generateTimeSeriesData = (count = 24, baseValue = 50, variance = 20) => {
  return Array.from({ length: count }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ":00";
    const randomValue = baseValue + (Math.random() * variance * 2) - variance;
    return {
      time: hour,
      value: Math.round(randomValue * 100) / 100,
    };
  });
};

const generateDiskData = () => {
  return [
    { name: "/ (root)", used: 70, free: 30 },
    { name: "/var", used: 45, free: 55 },
    { name: "/home", used: 85, free: 15 },
    { name: "/tmp", used: 20, free: 80 },
    { name: "/usr", used: 60, free: 40 },
  ];
};

const generateNetworkData = (count = 24) => {
  return Array.from({ length: count }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ":00";
    return {
      time: hour,
      inbound: Math.floor(Math.random() * 100),
      outbound: Math.floor(Math.random() * 80),
    };
  });
};

// Chart configurations
const chartConfigs = {
  cpu: {
    title: "CPU Utilization",
    data: generateTimeSeriesData(24, 35, 15),
    dataKey: "value",
    yAxisLabel: "%",
    color: "#0369a1",
  },
  memory: {
    title: "Memory Usage",
    data: generateTimeSeriesData(24, 60, 10),
    dataKey: "value",
    yAxisLabel: "%",
    color: "#8b5cf6",
  },
  disk: {
    title: "Disk Usage",
    data: generateDiskData(),
    yAxisLabel: "%",
  },
  network: {
    title: "Network Traffic",
    data: generateNetworkData(),
    yAxisLabel: "MB/s",
  },
  "container-cpu": {
    title: "Container CPU Usage",
    data: generateTimeSeriesData(24, 40, 20),
    dataKey: "value",
    yAxisLabel: "%",
    color: "#059669",
  },
  "container-memory": {
    title: "Container Memory Usage",
    data: generateTimeSeriesData(24, 50, 15),
    dataKey: "value",
    yAxisLabel: "%",
    color: "#d946ef",
  },
};

type MetricType = keyof typeof chartConfigs;
type ChartType = "line" | "bar" | "area";

interface MetricsChartProps {
  type: ChartType;
  metricType: MetricType;
  hostId?: string;
}

export const MetricsChart = ({ type, metricType, hostId }: MetricsChartProps) => {
  // In a real app, we would filter data based on hostId
  console.log(`Generating chart for ${metricType} on host: ${hostId || "all"}`);
  
  const config = chartConfigs[metricType];
  
  // Chart configuration based on type
  if (type === "line") {
    return (
      <ChartContainer
        className="h-[300px]"
        config={{
          metric: {
            label: config.title,
            color: config.color || "#3b82f6",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={config.dataKey || "value"}
              stroke="var(--color-metric)"
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "bar") {
    return (
      <ChartContainer
        className="h-[300px]"
        config={{
          used: {
            label: "Used",
            color: "#ef4444",
          },
          free: {
            label: "Free",
            color: "#10b981",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="used" fill="var(--color-used)" />
            <Bar dataKey="free" fill="var(--color-free)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  if (type === "area") {
    return (
      <ChartContainer
        className="h-[300px]"
        config={{
          inbound: {
            label: "Inbound",
            color: "#60a5fa",
          },
          outbound: {
            label: "Outbound",
            color: "#a78bfa",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="inbound"
              stackId="1"
              stroke="var(--color-inbound)"
              fill="var(--color-inbound)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="outbound"
              stackId="1"
              stroke="var(--color-outbound)"
              fill="var(--color-outbound)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return null;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <ChartTooltipContent
      className="border-none rounded-xl bg-background shadow-md z-50"
      payload={payload}
      label={label}
    />
  );
};
