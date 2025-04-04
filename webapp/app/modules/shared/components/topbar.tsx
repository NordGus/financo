import { SidebarIcon } from "lucide-react"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"

export function Topbar() {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="sticky top-0 z-30 flex gap-2 items-center bg-linear-to-b from-background from-40% via-background/50 via-70% to-transparent to-90% p-2">
      <Button
        onClick={toggleSidebar}
        size={"icon"}
        variant={"ghost"}
      >
        <SidebarIcon />
      </Button>
      <Breadcrumbs />
    </div>
  )
}