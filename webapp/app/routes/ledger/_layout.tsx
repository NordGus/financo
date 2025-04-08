import { Plus } from "lucide-react";
import { Outlet, useSearchParams } from "react-router";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { AccountsFilterBar } from "~/modules/ledger/components/accounts-filter-bar";
import { DateFilter } from "~/modules/ledger/components/date-filter";
import { AccountsFilter } from "~/modules/ledger/components/dialogs/accounts-filter";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FiltersContextProvider } from "~/modules/ledger/contexts/filters-contenxt";
import { Accounts } from "~/modules/ledger/types/accounts";
import { updateURLSearchParams } from "~/modules/ledger/types/filters";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { ToolBar } from "~/modules/shared/components/tool-bar";
import { Button } from "~/modules/shared/components/ui/button";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Ledger" },
    { name: "description", content: "Manage the Transactions between your Accounts" }
  ]
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const filters = getFilters(request)
  const accountsData = await listAccountsQuery()
  const accountsMap: Accounts = new Map(accountsData.map((account) => ([account.id, account])))
  const accounts = accountsData.filter(account => !account.parentId)

  return {
    breadcrumb: "Ledger",
    accounts,
    accountsMap,
    filters
  }
}

export default function Layout({ loaderData: { filters, accounts, accountsMap } }: Route.ComponentProps) {
  const [, setSearchParams] = useSearchParams()

  const onApplyAccountsFilter = (ids: number[]) => setSearchParams(prev => updateURLSearchParams(
    prev,
    { ...filters, accounts: [...ids] }
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
          <DateFilter />
          <AccountsFilter selected={filters.accounts} onApplyFilters={onApplyAccountsFilter} />
          <Button variant={"secondary"}>
            Filter categories
          </Button>
          <Button size={"icon"}>
            <Plus />
          </Button>
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
