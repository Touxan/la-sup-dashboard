
import { Menu, User, ChevronLeft, Server, Activity, Shield, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    label: "Infrastructure",
    icon: Server,
    subItems: [
      { label: "Servers", href: "#" },
      { label: "Networks", href: "#" },
      { label: "Storage", href: "#" },
      { label: "Load Balancers", href: "#" },
    ],
  },
  {
    label: "Monitoring",
    icon: Activity,
    subItems: [
      { label: "Metrics", href: "#" },
      { label: "Alerts", href: "#" },
      { label: "Logs", href: "#" },
      { label: "Traces", href: "#" },
    ],
  },
  {
    label: "Security",
    icon: Shield,
    subItems: [
      { label: "Access Control", href: "#" },
      { label: "Certificates", href: "#" },
      { label: "Firewall", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  },
  {
    label: "Automation",
    icon: Cog,
    subItems: [
      { label: "Workflows", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Scripts", href: "#" },
      { label: "Schedules", href: "#" },
    ],
  },
]

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar className="border-r border-border">
        <div className="p-4 flex items-center gap-2">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
          <span className="font-semibold">la-sup</span>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" className="w-48">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.label} asChild>
                            <a href={subItem.href}>{subItem.label}</a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>API Keys</DropdownMenuItem>
              <DropdownMenuItem>IAM Management</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  )
}

export default MainLayout
