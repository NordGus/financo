import { FunnelX } from "lucide-react";
import { use } from "react";
import { Link, useLocation } from "react-router";
import { isDefaultFilters } from "~/modules/achievements/trophies/types/filters";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { FiltersContext } from "../../contexts/filters-context";

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