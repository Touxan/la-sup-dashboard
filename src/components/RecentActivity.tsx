
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
    title: "Serveur tokyo-01 redémarré",
    description: "Maintenance planifiée réussie",
    time: "Il y a 25 minutes",
    type: "info"
  },
  {
    id: "2",
    title: "Alerte de sécurité",
    description: "Tentative d'accès non autorisée bloquée",
    time: "Il y a 2 heures",
    type: "warning"
  },
  {
    id: "3",
    title: "Mise à jour du système",
    description: "Nouvelles versions de sécurité appliquées",
    time: "Il y a 4 heures",
    type: "info"
  },
  {
    id: "4",
    title: "Problème de performance",
    description: "Latence élevée détectée sur le serveur paris-03",
    time: "Il y a 1 jour",
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
        <CardTitle className="text-lg font-medium">Activités récentes</CardTitle>
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
