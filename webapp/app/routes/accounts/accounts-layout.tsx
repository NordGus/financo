import { BookTextIcon, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import { ListFiltersContextProvider } from "~/modules/accounts/contexts/list-filters-context";
import { getListFilters } from "~/modules/accounts/utils/router-requests";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { Route } from "./+types/accounts-layout";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getListFilters(request)

  return {
    filters
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { filters } = loaderData

  const { pathname: newPathname } = useResolvedPath("accounts/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("accounts", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <ListFiltersContextProvider filters={filters}>
      <ToolSidebar title="Accounts">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === summaryPath}>
                  <Link to={{ pathname: summaryPath, search, hash }}>
                    <BookTextIcon /> My Finances
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === newPathname}>
                  <Link to={{ pathname: newPathname, search, hash }}>
                    <Plus /> New Account
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </ToolSidebar>
      <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
        <Outlet />
      </div>
    </ListFiltersContextProvider>
  )
}