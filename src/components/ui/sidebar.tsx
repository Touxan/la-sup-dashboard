
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

export { Sidebar }
