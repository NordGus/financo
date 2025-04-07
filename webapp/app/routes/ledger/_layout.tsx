import { Plus } from "lucide-react";
import { Outlet } from "react-router";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { DateFilter } from "~/modules/ledger/components/date-filter";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FiltersContextProvider } from "~/modules/ledger/contexts/filters-contenxt";
import { Accounts } from "~/modules/ledger/types/accounts";
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
  const accounts = await listAccountsQuery()
  const accountsMap: Accounts = new Map(accounts.map((account) => ([account.id, account])))

  return {
    breadcrumb: "Ledger",
    accounts,
    accountsMap,
    filters
  }
}

export default function Layout({ loaderData: { filters, accounts, accountsMap } }: Route.ComponentProps) {
  return (
    <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
      <FiltersContextProvider filters={filters}>
        <ToolBar>
          <DateFilter />
          <Button variant={"secondary"}>
            Filter Accounts
          </Button>
          <Button variant={"secondary"}>
            Filter categories
          </Button>
          <Button size={"icon"}>
            <Plus />
          </Button>
        </ToolBar>
        <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 gap-4 px-4">
          <Outlet />
        </div>
      </FiltersContextProvider>
    </AccountsContextProvider>
  )
}
