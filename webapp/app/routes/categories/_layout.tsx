import { BookTextIcon, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import { KindsFilters } from "~/modules/categories/components/filters/kinds";
import { StatusFilters } from "~/modules/categories/components/filters/status";
import { ListFiltersContextProvider } from "~/modules/categories/contexts/list-filters-context";
import { getListFilters } from "~/modules/categories/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Income and Expense categories of your books" }
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const currencies = await listCurrenciesQuery()
  const filters = getListFilters(request)

  return {
    currencies,
    filters
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { currencies, filters } = loaderData

  const { pathname: newPathname } = useResolvedPath("categories/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("categories", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <ListFiltersContextProvider filters={filters}>
        <div className="flex grow h-dvh overflow-hidden">
          <ToolSidebar title="Categories" className="min-w-[250px] max-w-[250px]">
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
                        <Plus /> New Category
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <StatusFilters />
            <KindsFilters />
          </ToolSidebar>
          <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
            <Outlet />
          </div>
        </div>
      </ListFiltersContextProvider>
    </CurrenciesContextProvider>
  )
}