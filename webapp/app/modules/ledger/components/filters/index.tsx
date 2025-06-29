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
import { ByAccount } from "./accounts";
import { ByCategory } from "./categories";
import { ByDate } from "./date";
import { ByPeriod } from "./period";

export function FiltersPanel() {
  const { filters, setFilters } = use(FiltersContext)
  const [__isSetFiltersTransitionPending, startSetFiltersTransition] = useTransition()
  const { pathname } = useLocation()

  const handlePeriodChange = useCallback((period: Period) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({
        ...prev,
        period,
        from: period === "unlimited" ? undefined : prev.from,
        to: period === "unlimited" ? undefined : prev.to
      }))
    })
  }, [setFilters, startSetFiltersTransition])

  const handleDateChange = useCallback((from: Date | undefined, to: Date | undefined) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({ ...prev, from, to }))
    })
  }, [setFilters, startSetFiltersTransition])

  const handleAccountsChange = useCallback((ids: number[]) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({ ...prev, accounts: ids }))
    })
  }, [setFilters, startSetFiltersTransition])

  const handleCategoriesChange = useCallback((ids: number[]) => {
    startSetFiltersTransition(() => {
      setFilters(prev => ({ ...prev, categories: ids }))
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
      <SidebarGroup className="m-0">
        <SidebarGroupLabel>
          Filter by Account
        </SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col justify-center items-center">
          <ByAccount
            value={filters.accounts}
            onChange={handleAccountsChange}
          />
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="m-0">
        <SidebarGroupLabel>
          Filter by Category
        </SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col justify-center items-center">
          <ByCategory
            value={filters.categories}
            onChange={handleCategoriesChange}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}