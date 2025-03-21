
import { Clock, Sparkles, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ActivityItem = {
  id: string
  title: string
  description: string
  time: string
  type: "info" | "warning" | "alert"
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Server tokyo-01 restarted",
    description: "Scheduled maintenance completed successfully",
    time: "25 minutes ago",
    type: "info"
  },
  {
    id: "2",
    title: "Security alert",
    description: "Unauthorized access attempt blocked",
    time: "2 hours ago",
    type: "warning"
  },
  {
    id: "3",
    title: "System update",
    description: "Security patches applied",
    time: "4 hours ago",
    type: "info"
  },
  {
    id: "4",
    title: "Performance issue",
    description: "High latency detected on paris-03 server",
    time: "1 day ago",
    type: "alert"
  }
]

const RecentActivity = () => {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "info":
        return <Sparkles className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity
