import { Outlet, useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsSearchResults } from "~/modules/ledger/components/transactions-search-results";
import { mapToExecutedTransactions } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Route } from "./+types/ledger";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const transactions = await listTransactionsQuery(getFilters(request))

  const executedTransactions = mapToExecutedTransactions(transactions)

  return {
    breadcrumb: "Ledger",
    executedTransactions
  }
}

export default function Index({ loaderData: { executedTransactions }, matches }: Route.ComponentProps) {
  const { data: { accountsMap } } = matches[2] // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.

  const { search } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <>
      <section className="flex flex-col h-full max-h-full overflow-y-auto no-scrollbar relative">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.search === search) && "hidden"
          )}
        />
        <div className="my-4 grow border rounded-lg overflow-clip">
          <TransactionsSearchResults transactions={executedTransactions} accounts={accountsMap} />
        </div>
      </section>
      <Outlet />
    </>
  )
}
