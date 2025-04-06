import { useLoaderData } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { ExecutedTransaction, ExecutedTransactions } from "../types/transactions";

/**
 * useExecutedTransactions is a custom hook that retrieves the executed transactions
 * data from the loader and returns it as a map of executed transactions grouped by date.
 *
 * @returns {ExecutedTransactions} A map of executed transactions grouped by date.
 */
export function useExecutedTransactions(): ExecutedTransactions {
  const { transactions } = useLoaderData<typeof clientLoader>()

  if (transactions.length === 0) return []

  return Object.entries(transactions.filter(({ executedAt }) => executedAt !== null)
    .reduce<Record<string, ExecutedTransaction[]>>((acc, transaction) => {
      const executed = transaction as ExecutedTransaction
      const key = executed.executedAt

      if (!acc[key]) acc[key] = [{ ...executed }]
      else acc[key].push({ ...executed })

      return acc
    }, {}))
    .sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]))
}