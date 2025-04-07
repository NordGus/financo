import { Outlet } from "react-router";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsSearchResults } from "~/modules/ledger/components/transactions-search-results";
import { mapToExecutedTransactions } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { Route } from "./+types/ledger";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const executedTransactions = mapToExecutedTransactions(await listTransactionsQuery(getFilters(request)))

  return { executedTransactions }
}

export default function Index({ loaderData: { executedTransactions }, matches }: Route.ComponentProps) {
  const { data: { accountsMap } } = matches[2] // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.

  return (
    <>
      <section className="flex flex-col h-full max-h-full overflow-y-auto no-scrollbar">
        <div className="my-4 grow border rounded-lg overflow-clip">
          <TransactionsSearchResults transactions={executedTransactions} accounts={accountsMap} />
        </div>
      </section>
      <Outlet />
    </>
  )
}
