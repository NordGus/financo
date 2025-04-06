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
    <SidebarProvider className="min-h-body items-stretch" defaultOpen={true}>
      <AppSidebar className="h-dvh" />
      <main className="flex flex-col grow h-dvh overflow-hidden">
        <ToolBar />
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location.search.length !== 0) && "hidden"
          )}
        />
        <div className="grow md:max-w-[80dvw] mx-auto overflow-y-auto no-scrollbar">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-center" closeButton richColors />
    </SidebarProvider >
  )
}