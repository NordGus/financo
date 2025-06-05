import { CreditCard, HandCoins, Landmark, PiggyBank, Vault } from "lucide-react";
import React, { use } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { AccountKind } from "~/modules/shared/types/account";
import { ListFiltersContext } from "../../contexts/list-filters-context";

const kinds: Record<AccountKind, React.ReactNode> = {
  capital: <><Landmark /> Capital</>,
  savings: <><PiggyBank /> Savings</>,
  debt: <><HandCoins /> Debt</>,
  credit: <><CreditCard /> Credit</>
}

export function KindsFilters() {
  const { filters, setFilters } = use(ListFiltersContext)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Kind
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.kinds.length === 0}
              onClick={() => setFilters(prev => ({ ...prev, kinds: [] }))}
            >
              <Vault /> All
            </SidebarMenuButton>
          </SidebarMenuItem>
          {
            (Object.entries(kinds) as [AccountKind, React.ReactNode][]).map(([kind, children]) => (
              <SidebarMenuItem key={`filter.kind.${kind}`}>
                <SidebarMenuButton
                  isActive={filters.kinds.includes(kind)}
                  onClick={() => {
                    if (filters.kinds.includes(kind))
                      setFilters(prev => ({ ...prev, kinds: prev.kinds.filter(k => k !== kind) }))
                    else
                      setFilters(prev => ({ ...prev, kinds: [...prev.kinds, kind] }))
                  }}
                >
                  {children}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}