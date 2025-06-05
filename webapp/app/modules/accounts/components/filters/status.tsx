import { Package, PackageOpen, SquaresIntersect } from "lucide-react";
import { use } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { ListFiltersContext } from "../../contexts/list-filters-context";

export function StatusFilters() {
  const { filters, setFilters } = use(ListFiltersContext)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Status
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.archived === undefined}
              onClick={() => setFilters(prev => ({ ...prev, archived: undefined }))}
            >
              <SquaresIntersect /> All
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.archived === false}
              onClick={() => setFilters(prev => ({
                ...prev, archived: prev.archived === false ? undefined : false
              }))}
            >
              <PackageOpen /> Active
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.archived === true}
              onClick={() => setFilters(prev => ({
                ...prev, archived: prev.archived === true ? undefined : true
              }))}
            >
              <Package /> Archived
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}