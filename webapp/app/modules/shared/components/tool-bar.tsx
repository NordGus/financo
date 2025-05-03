import { Sidebar } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function ToolBar({ className, children, ...props }: ComponentProps<"div">) {
  const { toggleSidebar, open, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-30 flex gap-2 items-center p-2 border-b",
        className
      )}
      {...props}
    >
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
            <Sidebar />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {
            open ? "Close Menu" : "Open Menu"
          }
        </TooltipContent>
      </Tooltip>
      <Breadcrumbs />
      <div className="grow flex gap-2 justify-end">
        {children}
      </div>
    </div>
  )
}