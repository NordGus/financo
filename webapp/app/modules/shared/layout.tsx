import { Outlet, useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { AppSidebar } from "./components/app-sidebar";
import { FullScreenThrobber } from "./components/throbber";
import { ToolBar } from "./components/tool-bar";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";

export default function Layout() {
  const location = useLocation()
  const { state: navigationState } = useNavigation()

  return (
    <SidebarProvider className="min-h-body items-stretch">
      <AppSidebar className="h-dvh" />
      <main className="relative grow">
        <div className="bg-background absolute inset-0 overflow-y-auto rounded-xl shadow-md/10">
          <ToolBar>
            <FullScreenThrobber
              className={cn(
                "absolute inset-0 z-50",
                (navigationState === "idle" || location.search.length !== 0) && "hidden"
              )}
            />
            <Outlet />
          </ToolBar>
        </div>
      </main>
      <Toaster position="top-center" closeButton richColors />
    </SidebarProvider >
  )
}