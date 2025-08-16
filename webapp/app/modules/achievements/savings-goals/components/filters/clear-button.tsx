import { FunnelX } from "lucide-react";
import { use } from "react";
import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { FiltersContext } from "../../contexts/filters-context";
import { isDefaultFilters } from "../../types/filters";

export default function ClearFiltersButton() {
  const { filters } = use(FiltersContext)
  const { pathname } = useLocation()

  if (isDefaultFilters(filters)) return null

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to={{ pathname }}>
                <FunnelX /> Reset Ledger Filters
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}