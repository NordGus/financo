import { FunnelX, Plus } from "lucide-react";
import { Link, Outlet, useLocation, useResolvedPath, useSearchParams } from "react-router";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { AccountsFilterBar } from "~/modules/ledger/components/accounts-filter-bar";
import { DateFilter } from "~/modules/ledger/components/date-filter";
import { AccountsFilter } from "~/modules/ledger/components/dialogs/accounts-filter";
import { CategoriesFilter } from "~/modules/ledger/components/dialogs/categories-filter";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FiltersContextProvider } from "~/modules/ledger/contexts/filters-contenxt";
import { Accounts } from "~/modules/ledger/types/accounts";
import { noFiltersApplied, updateURLSearchParams } from "~/modules/ledger/types/filters";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { ToolBar } from "~/modules/shared/components/tool-bar";
import { Button } from "~/modules/shared/components/ui/button";
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

  return {
    accounts,
    accountsMap,
    filters
  }
}

export default function Layout({ loaderData: { filters, accounts, accountsMap } }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname: newPathname } = useResolvedPath("ledger/new", { relative: "path" })
  const { pathname, search, hash } = useLocation()

  const onApplyAccountsFilter = (ids: number[]) => setSearchParams(prev => updateURLSearchParams(
    prev,
    { ...filters, accounts: [...ids] }
  ))

  const onApplyCategoriesFilter = (ids: number[]) => setSearchParams(prev => updateURLSearchParams(
    prev,
    { ...filters, categories: [...ids] }
  ))

  const onAccountFilterClicked = (id: number) => {
    setSearchParams(prev => updateURLSearchParams(
      prev,
      { ...filters, accounts: filters.accounts.filter(selected => selected !== id) }
    ))
  }

  const onCategoryFilterClicked = (id: number) => {
    setSearchParams(prev => updateURLSearchParams(
      prev,
      { ...filters, categories: filters.categories.filter(selected => selected !== id) }
    ))
  }

  return (
    <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
      <FiltersContextProvider filters={filters}>
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
          <DateFilter />
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
        <AccountsFilterBar selected={filters.accounts} onSelectedClick={onAccountFilterClicked} />
        <AccountsFilterBar selected={filters.categories} onSelectedClick={onCategoryFilterClicked} />
        <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 gap-4 px-4">
          <Outlet />
        </div>
      </FiltersContextProvider>
    </AccountsContextProvider>
  )
}
