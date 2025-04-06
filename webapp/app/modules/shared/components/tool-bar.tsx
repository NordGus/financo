import { Sidebar } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"

export function ToolBar({ className, ...props }: ComponentProps<"div">) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-30 flex gap-2 items-center px-2 py-1 border-b",
        className
      )}
      {...props}
    >
      <Button
        type="button"
        onClick={toggleSidebar}
        variant={"ghost"}
        className={
          cn("cursor-pointer size-7", open && "bg-accent dark:bg-accent/50")
        }
        size={"icon"}
      >
        <Sidebar />
      </Button>
      <Breadcrumbs />
      <span className="grow content-[' ']" />
    </div>
  )
}