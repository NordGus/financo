import { Sidebar as SidebarIcon } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ToolSidebar({ title, children, ...props }: ComponentProps<typeof Sidebar> & { title: string }) {
  const { toggleSidebar, open, isMobile } = useSidebar()

  return (
    <Sidebar
      collapsible="none"
      className="h-dvh"
      {...props}
    >
      <SidebarHeader className="flex-row items-center gap-4 border-b sidebar-border-sidebar">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={toggleSidebar}
              variant={"ghost"}
              className={
                cn("cursor-pointer", open && !isMobile && "bg-accent dark:bg-accent/50")
              }
              size={"icon"}
            >
              <SidebarIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {open ? "Close Menu" : "Open Menu"}
          </TooltipContent>
        </Tooltip>
        <h1>{title}</h1>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {children}
      </SidebarContent>
    </Sidebar>
  )
}