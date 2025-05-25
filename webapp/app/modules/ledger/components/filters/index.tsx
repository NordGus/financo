import { FunnelX } from "lucide-react";
import { use, useCallback, useTransition } from "react";
import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { FiltersContext } from "../../contexts/filters-context";
import { isDefaultFilters, Period } from "../../types/filters";
import { ByDate } from "./date";
import { ByPeriod } from "./period";

export function FiltersPanel() {
  const { filters, setFilters } = use(FiltersContext)
  const [__isSetFiltersTransitionPending, startSetFiltersTransition] = useTransition()
  const { pathname } = useLocation()

  const handlePeriodChange = useCallback((period: Period) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({ ...prev, period }))
    })
  }, [setFilters, startSetFiltersTransition])

  const handleDateChange = useCallback((from: Date | undefined, to: Date | undefined) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({ ...prev, from, to }))
    })
  }, [setFilters, startSetFiltersTransition])

  return (
    <>
      {
        !isDefaultFilters(filters) && (
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
        <SidebarGroupLabel>
          Filter by Date
        </SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col justify-center items-center">
          <ByPeriod
            value={filters.period}
            onChange={handlePeriodChange}
          />
          <ByDate
            period={filters.period}
            from={filters.from}
            to={filters.to}
            onChange={handleDateChange}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}