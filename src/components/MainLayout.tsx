
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Scroll,
  BarChart,
  Server,
  Shield,
  AlarmClock,
  Play,
  Bell,
  FileCode,
  Key, // Changed from Certificate to Key
  UserCog,
} from "lucide-react";

const MainLayout = () => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Logs",
      path: "/logs",
      icon: <Scroll className="h-5 w-5" />,
    },
    {
      name: "Metrics",
      path: "/metrics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Server className="h-5 w-5" />,
    },
    {
      name: "Security",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: "Security Groups",
          path: "/security/groups",
        },
        {
          name: "Security Events",
          path: "/security/events",
        },
      ],
    },
    {
      name: "Workflows",
      path: "/workflows",
      icon: <AlarmClock className="h-5 w-5" />,
    },
    {
      name: "Executions",
      path: "/executions",
      icon: <Play className="h-5 w-5" />,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Templates",
      path: "/templates",
      icon: <FileCode className="h-5 w-5" />,
    },
    {
      name: "Certificates",
      path: "/certificates",
      icon: <Key className="h-5 w-5" />, // Changed from Certificate to Key
    },
    // Show Admin link only for admin users
    ...(userRole === "admin" ? [{
      name: "Administration",
      path: "/admin",
      icon: <UserCog className="h-5 w-5" />,
    }] : []),
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen} 
        onOpenChange={setSidebarOpen}
        className="border-r"
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6" />
            <span className={sidebarOpen ? "block" : "hidden"}>CloudAdmin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item, index) =>
              "items" in item ? (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground">
                    {item.icon}
                    <span className={sidebarOpen ? "block" : "hidden"}>
                      {item.name}
                    </span>
                  </div>
                  <div className="space-y-1 ml-6">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                          location.pathname === subItem.path
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span className={sidebarOpen ? "block" : "hidden"}>
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon}
                  <span className={sidebarOpen ? "block" : "hidden"}>
                    {item.name}
                  </span>
                </Link>
              )
            )}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-2">
          <div className="flex items-center gap-2 rounded-md p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium">
                  {user?.email || "Utilisateur"}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {userRole || "Rôle non défini"}
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
