
import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen = true, onOpenChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col overflow-hidden",
          isOpen ? "w-64" : "w-16",
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      />
    )
  }
)

Sidebar.displayName = "Sidebar"

// Create a SidebarContext to manage the sidebar state
interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined);

// Create a SidebarProvider component
interface SidebarProviderProps {
  children: React.ReactNode;
  defaultIsOpen?: boolean;
}

const SidebarProvider = ({ children, defaultIsOpen = true }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook to use the sidebar context
const useSidebar = (): SidebarContextProps => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export { Sidebar, SidebarProvider, useSidebar }

