import { add } from "date-fns";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Screen } from "~/modules/ledger/screens";
import { useTransactionsStore } from "~/modules/ledger/stores/transactions";
import { Filters } from "~/modules/ledger/types/transactions";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Ledger" },
    { name: "description", content: "Manage the Transactions between your Accounts" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Ledger"
  }
}

export default function Index() {
  const transactions = useTransactionsStore((state) => state.transactions)
  const accounts = useTransactionsStore((state) => state.accounts)

  const listTransactionsQuery = useTransactionsStore((state) => state.list)
  const listAccountsQuery = useTransactionsStore((state) => state.listAccounts)

  const [searchParams, setSearchParams] = useSearchParams()

  const search = useCallback(
    async (filters: Filters, signal: AbortSignal, success: () => void, failure: () => void) => {
      try {
        await listTransactionsQuery(filters, signal)

        success()
      } catch (error) {
        failure()

        throw error
      }
    },
    [listTransactionsQuery]
  )

  useEffect(() => {
    const abort = new AbortController()

    const load = async () => {
      await Promise.allSettled([
        listTransactionsQuery({
          from: add(new Date(), { months: -1 }),
          to: new Date()
        }, abort.signal),
        listAccountsQuery(),
      ])
    }

    load()
    return () => { abort.abort() }
  }, [])

  return <Screen
    transactions={transactions}
    accounts={accounts}

    searchParams={searchParams}
    onSearchParamsChange={setSearchParams}

    onSearchActions={search}
  />
}