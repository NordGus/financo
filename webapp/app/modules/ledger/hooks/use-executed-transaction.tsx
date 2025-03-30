import { useLoaderData } from "react-router";
import { clientLoader } from "~/routes/ledger";
import { ExecutedTransaction, ExecutedTransactions } from "../types/transactions";

type None = {
  empty: true
  data: null
}

type Value<T> = {
  empty: null,
  data: T
}

type Results<T> = None | Value<T>

function none(): None {
  return { empty: true, data: null }
}

function value<T>(data: T): Value<T> {
  return {
    empty: null,
    data,
  }
}

/**
 * useExecutedTransaction is a custom hook that retrieves the executed transactions
 * data from the loader and returns it as a map of executed transactions grouped by date.
 *
 * @returns {ExecutedTransactions} A map of executed transactions grouped by date.
 */
export function useExecutedTransaction(): Results<ExecutedTransactions> {
  const { transactions } = useLoaderData<typeof clientLoader>()

  if (transactions.length === 0) return none()

  return value(
    Object.entries(transactions.filter(({ executedAt }) => executedAt !== null)
      .reduce<Record<string, ExecutedTransaction[]>>((acc, transaction) => {
        const executed = transaction as ExecutedTransaction
        const key = executed.executedAt

        if (!acc[key]) acc[key] = [{ ...executed }]
        else acc[key].push({ ...executed })

        return acc
      }, {}))
  )
}