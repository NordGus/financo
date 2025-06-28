import { ArrowDown, ArrowUp, Bookmark } from "lucide-react";
import React, { use } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { ListFiltersContext } from "../../contexts/list-filters-context";
import { Kind } from "../../types/category";

const kinds: Record<Kind, React.ReactNode> = {
  expense: <><ArrowDown /> Expense</>,
  income: <><ArrowUp /> Income</>
}

export function KindsFilters() {
  const { filters, setFilters } = use(ListFiltersContext)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Filter by Kind
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={filters.kinds.length === 0}
              onClick={() => setFilters(prev => ({ ...prev, kinds: [] }))}
            >
              <Bookmark /> All
            </SidebarMenuButton>
          </SidebarMenuItem>
          {
            (Object.entries(kinds) as [Kind, React.ReactNode][]).map(([kind, children]) => (
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