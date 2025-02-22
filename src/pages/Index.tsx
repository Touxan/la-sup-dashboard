
import { SidebarProvider } from "@/components/ui/sidebar"
import MainLayout from "@/components/MainLayout"
import DashboardMetrics from "@/components/DashboardMetrics"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainLayout>
          <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Vue d'ensemble</span>
                <h1 className="text-3xl font-semibold tracking-tight">Tableau de bord</h1>
              </div>
            </div>
            <DashboardMetrics />
          </div>
        </MainLayout>
      </div>
    </SidebarProvider>
  )
}

export default Index
