import { Outlet, useLocation, useNavigation } from "react-router";
import { AppSidebar } from "./components/app-sidebar";
import { Throbber } from "./components/throbber";
import { Topbar } from "./components/topbar";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";

export default function Layout() {
  const location = useLocation()
  const { state: navigationState } = useNavigation()

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <main className="block min-h-100dvh w-full overflow-y-auto">
        <Topbar />
        {
          navigationState === "loading" && location.search.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Throbber />
            </div>
          ) : <Outlet />
        }
        <Toaster position="top-center" closeButton richColors />
      </main>
    </SidebarProvider >
  )
}