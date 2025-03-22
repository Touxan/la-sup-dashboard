
import { Menu, User, ChevronLeft, Server, Activity, Shield, Cog, Bell, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  SidebarProvider,
} from "@/components/ui/sidebar"
import ChatBot from "@/components/ChatBot"

const menuItems = [
  {
    label: "Inventory",
    icon: Server,
    subItems: [
      { label: "Servers", href: "/inventory/servers" },
      { label: "Networks", href: "/inventory/networks" },
      { label: "Storage", href: "" },
      { label: "Load Balancers", href: "#" },
    ],
  },
  {
    label: "Monitoring",
    icon: Activity,
    subItems: [
      { label: "Metrics", href: "/monitoring/metrics" },
      { label: "Logs", href: "/monitoring/logs" },
      { label: "Alerts", href: "/monitoring/alerts" },
    ],
  },
  {
    label: "Security",
    icon: Shield,
    subItems: [
      { label: "Events", href: "/security/events" },
      { label: "Certificates", href: "/security/certificates" },
      { label: "Security Groups", href: "/security/groups" },
    ],
  },
  {
    label: "Automation",
    icon: Cog,
    subItems: [
      { label: "Workflows", href: "/automation/workflows" },
      { label: "Executions", href: "/automation/executions" },
      { label: "Templates", href: "/automation/templates" },
    ],
  },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-border">
          <div className="p-4 flex items-center gap-2">
            <SidebarTrigger>
              <ChevronLeft className="h-4 w-4" />
            </SidebarTrigger>
            <Link to="/" className="font-semibold hover:text-primary transition-colors">
              la-sup
            </Link>
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
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" className="w-48">
                          {item.subItems.map((subItem) => (
                            <DropdownMenuItem key={subItem.label} asChild>
                              <Link to={subItem.href}>{subItem.label}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
                  
                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin">
                          <Users className="w-4 h-4" />
                          <span>Administration</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <header className="h-14 border-b border-border px-6 flex items-center justify-between sticky top-0 z-10 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/myaccount/settings">Settings</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Administration</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <User className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
      
      <ChatBot />
    </SidebarProvider>
  );
};

export default MainLayout;
