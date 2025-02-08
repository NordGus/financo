import { format } from "date-fns";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { filterFrom, filterTo } from "~/modules/ledger/defaults/filters";
import { Screen } from "~/modules/ledger/screens";
import { useTransactionsStore } from "~/modules/ledger/stores/transactions";
import { Filters } from "~/modules/ledger/types/transactions";
import { SearchAbortedError } from "~/modules/shared/types/errors";
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

  const initStore = useTransactionsStore((state) => state.init)
  const listTransactionsQuery = useTransactionsStore((state) => state.list)

  const [searchParams, setSearchParams] = useSearchParams()

  const filters: Filters = useMemo(() => {
    const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : filterFrom()
    const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : filterTo()
    const accounts = searchParams.getAll("accounts").map((id) => Number(id))
    const categories = searchParams.getAll("categories").map((id) => Number(id))

    return { from, to, accounts, categories }
  }, [searchParams])

  const onSearchParamsChange = useCallback((filters: Filters) => {
    setSearchParams(
      Object.fromEntries(
        [
          ["from", !filters.from ? undefined : format(filters.from, "yyyy-MM-dd")],
          ["to", !filters.to ? undefined : format(filters.to, "yyyy-MM-dd")],
          ["accounts", filters.accounts?.map((id) => id.toString())],
          ["categories", filters.categories?.map((id) => id.toString())]
        ].filter(([__key, value]) => !!value)
      )
    )
  }, [setSearchParams])

  const search = useCallback(
    async (filters: Filters, signal: AbortSignal, success: () => void, failure: () => void) => {
      onSearchParamsChange(filters)

      try {
        await listTransactionsQuery(filters, signal)

        success()
      } catch (error) {
        failure()

        if (error instanceof SearchAbortedError) return; // this is an expected error

        toast.error("Oops!. Something went wrong")

        console.error({ action: "ledger: search transactions", error })
      }
    },
    [listTransactionsQuery, onSearchParamsChange]
  )

  useEffect(() => {
    const abort = new AbortController()

    onSearchParamsChange({ ...filters })
    initStore({ ...filters }, abort.signal)
    return () => { abort.abort() }
  }, [])

  return <Screen
    transactions={transactions}
    accounts={accounts}

    filters={filters}

    onSearchAction={search}
  />
}