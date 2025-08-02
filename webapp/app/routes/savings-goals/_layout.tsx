import { BookTextIcon, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import ClearFiltersButton from "~/modules/achievements/savings-goals/components/filters/clear-button";
import { CurrenciesFilters } from "~/modules/achievements/savings-goals/components/filters/currencies";
import { FiltersContextProvider } from "~/modules/achievements/savings-goals/contexts/filters-context";
import { getFilters } from "~/modules/achievements/savings-goals/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/modules/shared/components/ui/sidebar";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Savings Goals" },
    { name: "description", content: "Manage your savings objectives" }
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const currencies = await listCurrenciesQuery()

  return {
    currencies,
    filters
  }
}

export default function SavingsGoals({ loaderData }: Route.ComponentProps) {
  const { currencies, filters } = loaderData

  const { pathname: newPathname } = useResolvedPath("savings-goals/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("savings-goals", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <FiltersContextProvider filters={filters}>
        <div className="flex grow h-dvh overflow-hidden">
          <ToolSidebar title="Savings Goals" className="min-w-[250px] max-w-[250px]">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === summaryPath}>
                      <Link to={{ pathname: summaryPath, search, hash }}>
                        <BookTextIcon /> Summary
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === newPathname}>
                      <Link to={{ pathname: newPathname, search, hash }}>
                        <Plus /> New Goal
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <ClearFiltersButton />
            <CurrenciesFilters />
          </ToolSidebar>
          <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
            <Outlet />
          </div>
        </div>
      </FiltersContextProvider>
    </CurrenciesContextProvider>
  )
}