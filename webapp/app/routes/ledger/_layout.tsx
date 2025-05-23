import { FunnelX, Plus, Sidebar as SidebarIcon } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { AccountsFilter } from "~/modules/ledger/components/dialogs/accounts-filter";
import { CategoriesFilter } from "~/modules/ledger/components/dialogs/categories-filter";
import { TransactionsFilters } from "~/modules/ledger/components/dialogs/transactions-filters";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FiltersContextProvider } from "~/modules/ledger/contexts/filters-context";
import { Account, AccountChildren, Accounts } from "~/modules/ledger/types/accounts";
import { noFiltersApplied, updateURLSearchParams } from "~/modules/ledger/types/filters";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { ToolBar } from "~/modules/shared/components/tool-bar";
import { Button } from "~/modules/shared/components/ui/button";
import { Calendar } from "~/modules/shared/components/ui/calendar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/modules/shared/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
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
  loaderData: { filters, accounts, accountsMap, accountsChildren }
}: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname: newPathname } = useResolvedPath("ledger/new", { relative: "path" })
  const { pathname, search, hash } = useLocation()
  const { toggleSidebar, open, isMobile } = useSidebar()

  const onApplyAccountsFilter = (ids: number[]) => setSearchParams(prev => updateURLSearchParams(
    prev,
    { ...filters, accounts: [...ids] }
  ))

  const onApplyCategoriesFilter = (ids: number[]) => setSearchParams(prev => updateURLSearchParams(
    prev,
    { ...filters, categories: [...ids] }
  ))

  return (
    <AccountsContextProvider accounts={accounts} accountsMap={accountsMap} accountsChildren={accountsChildren}>
      <FiltersContextProvider filters={filters}>
        <div className="flex grow h-dvh overflow-hidden">
          <Sidebar
            collapsible="none"
            className="h-dvh"
          >
            <SidebarHeader className="flex-row items-center gap-4 border-b sidebar-border-sidebar">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={toggleSidebar}
                    variant={"ghost"}
                    className={
                      cn("cursor-pointer", open && !isMobile && "bg-accent dark:bg-accent/50")
                    }
                    size={"icon"}
                  >
                    <SidebarIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {open ? "Close Menu" : "Open Menu"}
                </TooltipContent>
              </Tooltip>
              <h1>Ledger</h1>
            </SidebarHeader>
            <SidebarContent className="gap-0">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {
                      !noFiltersApplied(searchParams) && (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to={pathname}>
                              <FunnelX /> Reset Ledger Filters
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to={{ pathname: newPathname, search, hash }}>
                          <Plus /> New Transaction
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="m-0">
                <SidebarGroupContent className="flex flex-col justify-center items-center">
                  <Calendar
                    className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
                  />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <ToolBar>
              {
                !noFiltersApplied(searchParams) && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button asChild variant={"ghost"} size={"icon"}>
                        <Link to={pathname}>
                          <FunnelX />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Reset Ledger Filters
                    </TooltipContent>
                  </Tooltip>
                )
              }
              <TransactionsFilters />
              <AccountsFilter selected={filters.accounts} onApplyFilters={onApplyAccountsFilter} />
              <CategoriesFilter selected={filters.categories} onApplyFilters={onApplyCategoriesFilter} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size={"icon"}>
                    <Link to={{ pathname: newPathname, search, hash }}>
                      <Plus />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Create New Transaction
                </TooltipContent>
              </Tooltip>
            </ToolBar>
            <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </FiltersContextProvider>
    </AccountsContextProvider>
  )
}
