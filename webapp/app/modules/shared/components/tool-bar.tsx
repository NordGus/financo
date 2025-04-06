import { Sidebar } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"

export function ToolBar({ className, children, ...props }: ComponentProps<"div">) {
  const { toggleSidebar, open, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-30 flex gap-2 items-center px-4 py-2 border-b",
        className
      )}
      {...props}
    >
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
      <Breadcrumbs />
      <span className="grow content-[' ']" />
      {children}
    </div>
  )
}