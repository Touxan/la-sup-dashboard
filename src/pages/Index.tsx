
import { SidebarProvider } from "@/components/ui/sidebar"
import MainLayout from "@/components/MainLayout"
import DashboardMetrics from "@/components/DashboardMetrics"
import RecentActivity from "@/components/RecentActivity"
import QuickStats from "@/components/QuickStats"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const Index = () => {
  const { user } = useAuth();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainLayout>
          <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <h1 className="text-3xl font-semibold tracking-tight">Tableau de bord</h1>
              </div>
              <p className="text-muted-foreground">
                Bienvenue{user?.email ? `, ${user.email.split('@')[0]}` : ''} ! Voici un aperçu de votre infrastructure.
              </p>
              
              <NavigationMenu className="mt-4">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Accès rapide</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {[
                          { title: "Serveurs", href: "/inventory/servers", description: "Gérer vos serveurs et infrastructure" },
                          { title: "Alertes", href: "/monitoring/alerts", description: "Consulter et gérer vos alertes" },
                          { title: "Sécurité", href: "/security/events", description: "Événements de sécurité et conformité" },
                          { title: "Automatisation", href: "/automation/workflows", description: "Workflows et processus automatisés" }
                        ].map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                )}
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <QuickStats />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <DashboardMetrics />
              </div>
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>
            
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Actions recommandées</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Certificats SSL</p>
                      <p className="text-xs text-muted-foreground">3 certificats expirent dans moins de 30 jours</p>
                      <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                        <Link to="/security/certificates">
                          Vérifier <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Mises à jour systèmes</p>
                      <p className="text-xs text-muted-foreground">12 serveurs nécessitent des mises à jour de sécurité</p>
                      <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                        <Link to="/inventory/servers">
                          Consulter <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Groupe de sécurité</p>
                      <p className="text-xs text-muted-foreground">Révision recommandée pour 2 groupes</p>
                      <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                        <Link to="/security/groups">
                          Examiner <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </SidebarProvider>
  )
}

export default Index

// Import manquant pour Card et CardContent
import { Card, CardContent } from "@/components/ui/card"
