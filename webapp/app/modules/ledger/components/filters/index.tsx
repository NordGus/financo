import { FunnelX } from "lucide-react";
import { use } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { FiltersContext } from "../../contexts/filters-context";
import { noFiltersApplied } from "../../types/filters";
import { ByDate } from "./date";
import { ByPeriod } from "./period";

export function FiltersPanel() {
  const { filters, setFilters } = use(FiltersContext)
  const [searchParams,] = useSearchParams()
  const { pathname } = useLocation()

  return (
    <>

      {
        !noFiltersApplied(searchParams) && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={pathname}>
                      <FunnelX /> Reset Ledger Filters
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      }
      <SidebarGroup className="m-0">
        <SidebarGroupContent className="flex flex-col justify-center items-center">
          <ByPeriod
            value={filters.period}
            onChange={(period) => setFilters(prev => ({ ...prev, period }))}
          />
          <ByDate
            period={filters.period}
            from={filters.from}
            to={filters.to}
            onChange={(from, to) => setFilters(prev => ({ ...prev, from, to }))}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}