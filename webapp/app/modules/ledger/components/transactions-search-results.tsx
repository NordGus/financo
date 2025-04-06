import { useMemo } from "react"
import { useAccountsMap } from "../hooks/use-accounts-map"
import { useExecutedTransactions } from "../hooks/use-executed-transaction"
import { Transaction } from "../types/transactions"
import { DateGroup } from "./date-group"
import { Entry } from "./entry"
import { NoResults } from "./no-results"

type OnTransactionClick = (transaction: Transaction) => void

interface Props {
  onTransactionClick?: OnTransactionClick
}

export function TransactionsSearchResults({ }: Props) {
  const transactions = useExecutedTransactions()
  const accounts = useAccountsMap()
  const last = useMemo(() => transactions.length - 1, [transactions.length])

  if (transactions.length === 0) return <NoResults />

  return transactions.map(([date, entries], idx) => (
    <DateGroup key={date} date={date} isLast={idx === last}>
      {entries.map((transaction) => {
        const source = accounts.get(transaction.sourceId)!
        const sourceParent = source.parentId === null ? null : accounts.get(source.parentId)!
        const target = accounts.get(transaction.targetId)!
        const targetParent = target.parentId === null ? null : accounts.get(target.parentId)!

        return (
          <Entry
            key={`${date}.${transaction.id}`}
            transaction={transaction}
            source={source}
            sourceParent={sourceParent}
            target={target}
            targetParent={targetParent}
            futureEnable
          />
        )
      })}
    </DateGroup>
  ))
}