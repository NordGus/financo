import { ChartNoAxesCombined, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath } from "react-router";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { FiltersPanel } from "~/modules/ledger/components/filters";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FiltersContextProvider } from "~/modules/ledger/contexts/filters-context";
import { Account, AccountChildren, Accounts } from "~/modules/ledger/types/accounts";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/modules/shared/components/ui/sidebar";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Ledger" },
    { name: "description", content: "Manage the Transactions between your Accounts" }
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const accountsData = await listAccountsQuery()
  const accountsMap: Accounts = new Map(accountsData.map((account) => ([account.id, account])))
  const accounts = accountsData.filter(account => !account.parentId)
  const accountsChildren: AccountChildren = accountsData.filter(account => !!account.parentId)
    .reduce((acc, account) => {
      if (!acc.has(account.parentId!)) acc.set(account.parentId!, [])

      acc.get(account.parentId!)!.push(account)

      return acc
    }, new Map<number, Account[]>())


  return {
    accounts,
    accountsMap,
    accountsChildren,
    filters
  }
}

export default function Layout({
  loaderData: {
    filters,
    accounts,
    accountsMap,
    accountsChildren
  }
}: Route.ComponentProps) {
  const { pathname: newPathname } = useResolvedPath("ledger/new", { relative: "path" })
  const { pathname: summaryPath } = useResolvedPath("ledger", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  return (
    <AccountsContextProvider accounts={accounts} accountsMap={accountsMap} accountsChildren={accountsChildren}>
      <FiltersContextProvider filters={filters}>
        <div className="flex grow h-dvh overflow-hidden">
          <ToolSidebar
            title="Ledger"
          >
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === summaryPath}>
                      <Link to={{ pathname: summaryPath, search, hash }}>
                        <ChartNoAxesCombined /> Transactions Summary
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === newPathname}>
                      <Link to={{ pathname: newPathname, search, hash }}>
                        <Plus /> New Transaction
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <FiltersPanel />
          </ToolSidebar>
          <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
            <Outlet />
          </div>
        </div>
      </FiltersContextProvider>
    </AccountsContextProvider>
  )
}
