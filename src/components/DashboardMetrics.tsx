
import { ChevronUp, Server, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  {
    title: "Servers",
    value: "45",
    status: "All operational",
    icon: Server,
  },
  {
    title: "Security",
    value: "98%",
    status: "Global score",
    icon: Shield,
  },
  {
    title: "Performance",
    value: "99.9%",
    status: "Uptime",
    icon: Zap,
  },
]

const DashboardMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ChevronUp className="h-3 w-3 text-emerald-500 mr-1" />
              {metric.status}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DashboardMetrics
