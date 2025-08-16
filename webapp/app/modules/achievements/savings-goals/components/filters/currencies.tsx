import { use } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { CurrenciesContext } from "~/modules/shared/contexts/currencies-context";
import { FiltersContext } from "../../contexts/filters-context";

export function CurrenciesFilters() {
  const { filters, setFilters } = use(FiltersContext)
  const { currencies } = use(CurrenciesContext)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Filter by Currency
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.currencies.length === 0}
              onClick={() => setFilters(prev => ({ ...prev, currencies: [] }))}
            >
              All
            </SidebarMenuButton>
          </SidebarMenuItem>
          {
            currencies.sort(({ name: a }, { name: b }) => a.localeCompare(b)).map(({ code, name }) => (
              <SidebarMenuItem key={`filter.currency.${code}`}>
                <SidebarMenuButton
                  isActive={filters.currencies.includes(code)}
                  onClick={() => {
                    if (filters.currencies.includes(code))
                      setFilters(prev => ({
                        ...prev,
                        currencies: prev.currencies.filter(currency => currency !== code)
                      }))
                    else
                      setFilters(prev => ({
                        ...prev,
                        currencies: [...prev.currencies, code]
                      }))
                  }}
                >
                  {name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}