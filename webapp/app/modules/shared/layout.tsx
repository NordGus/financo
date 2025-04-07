import { Outlet, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { Route } from "./+types/layout";
import { list as listCurrenciesQuery } from "./api/queries/list-currencies";
import { AppSidebar } from "./components/app-sidebar";
import { FullScreenThrobber } from "./components/throbber";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { CurrenciesContextProvider } from "./contexts/currencies-context";

export async function clientLoader({ }: Route.LoaderArgs) {
  const currencies = await listCurrenciesQuery()

  return {
    breadcrumb: "financo",
    currencies
  }
}

export default function Layout({ loaderData: { currencies } }: Route.ComponentProps) {
  const { state: navigationState } = useNavigation()

  return (
    <CurrenciesContextProvider currencies={currencies} >
      <SidebarProvider className="min-h-body items-stretch" defaultOpen={true}>
        <AppSidebar className="h-dvh" />
        <main className="flex flex-col grow h-dvh overflow-hidden relative">
          <FullScreenThrobber
            className={cn(
              "absolute inset-0 z-50",
              (navigationState === "idle") && "hidden"
            )}
          />
          <Outlet />
        </main>
        <Toaster position="top-center" closeButton richColors />
      </SidebarProvider >
    </CurrenciesContextProvider>
  )
}