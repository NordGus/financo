import { BookTextIcon, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { Route } from "./+types/accounts-layout";

// export async function clientLoader({ }: Route.ClientLoaderArgs) {
//   const currencies = await listCurrenciesQuery()

//   return {
//     currencies
//   }
// }

export default function Layout({ }: Route.ComponentProps) {
  const { pathname: newPathname } = useResolvedPath("accounts/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("accounts", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <>
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
    </>
  )
}