import { Outlet, useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { Route } from "./+types/layout";
import { list as listCurrenciesQuery } from "./api/queries/list-currencies";
import { AppSidebar } from "./components/app-sidebar";
import { FullScreenThrobber } from "./components/throbber";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const currencies = await listCurrenciesQuery()

  return {
    currencies
  }
}

export default function Layout({ }: Route.ComponentProps) {
  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <SidebarProvider className="min-h-body items-stretch" defaultOpen={true}>
      <AppSidebar className="h-dvh" collapsible="icon" />
      <main className="flex flex-col grow h-dvh overflow-hidden relative">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.pathname === pathname) && "hidden"
          )}
        />
        <Outlet />
      </main>
      <Toaster position="top-center" closeButton richColors />
    </SidebarProvider >
  )
}