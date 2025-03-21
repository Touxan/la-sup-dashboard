
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Shield, Server, Zap } from "lucide-react"

type QuickStat = {
  label: string
  value: string
  icon: React.ElementType
  trend: "up" | "down" | "neutral"
  trendValue: string
}

const quickStats: QuickStat[] = [
  {
    label: "Alertes actives",
    value: "5",
    icon: Activity,
    trend: "down",
    trendValue: "-2 depuis hier"
  },
  {
    label: "Certificats expirants",
    value: "3",
    icon: Shield,
    trend: "up",
    trendValue: "+1 depuis la semaine dernière"
  },
  {
    label: "Serveurs critiques",
    value: "0",
    icon: Server,
    trend: "neutral",
    trendValue: "Tous stables"
  },
  {
    label: "Performance globale",
    value: "97.8%",
    icon: Zap,
    trend: "up",
    trendValue: "+0.3% ce mois"
  }
]

const QuickStats = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {quickStats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-xs mt-1 ${
                stat.trend === "up" ? "text-emerald-500" : 
                stat.trend === "down" ? "text-amber-500" : 
                "text-muted-foreground"
              }`}>
                {stat.trendValue}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default QuickStats
