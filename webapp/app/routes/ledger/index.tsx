import { createSearchParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { list as listAccountsQuery } from "~/modules/ledger/api/queries/accounts/list";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { useAccountsMap } from "~/modules/ledger/hooks/use-accounts-map";
import { Screen } from "~/modules/ledger/screens";
import { Filters, fromURLSearchParams, updateURLSearchParams } from "~/modules/ledger/types/filters";
import { SearchAbortedError } from "~/modules/shared/types/errors";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Ledger" },
    { name: "description", content: "Manage the Transactions between your Accounts" }
  ]
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams
  const filters = fromURLSearchParams(searchParams)

  const [accounts, transactions] = await Promise.allSettled([
    listAccountsQuery(),
    listTransactionsQuery(filters),
  ]);

  if (accounts.status === "rejected") throw new Error(accounts.reason)
  if (transactions.status === "rejected") throw new Error(transactions.reason)

  return {
    breadcrumb: "Ledger",
    accounts: accounts.value,
    transactions: transactions.value,
    filters
  }
}

export default function Index({ loaderData: { filters } }: Route.ComponentProps) {
  const accounts = useAccountsMap()
  const [, setSearchParams] = useSearchParams()

  const search = async (filters: Filters, __signal: AbortSignal, success: () => void, failure: () => void) => {
    setSearchParams((prev) => createSearchParams(updateURLSearchParams(prev, filters)))

    try {
      // await listTransactionsQuery(filters, signal)

      success()
    } catch (error) {
      failure()

      if (error instanceof SearchAbortedError) return; // this is an expected error

      toast.error("Oops!. Something went wrong")

      console.error({ action: "ledger: search transactions", error })
    }
  }

  return <Screen
    accounts={accounts}

    filters={filters}

    onSearchAction={search}
  />
}
