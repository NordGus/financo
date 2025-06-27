import { BookTextIcon, Plus } from "lucide-react";
import { PropsWithChildren } from "react";
import {
  Link,
  useLocation,
  useResolvedPath
} from "react-router";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";

export function AccountsSidebar({ children }: PropsWithChildren) {
  const { pathname: newPathname } = useResolvedPath("accounts/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("accounts", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <ToolSidebar title="Accounts" className="min-w-[250px] max-w-[250px]">
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
      {children}
    </ToolSidebar>
  )
}