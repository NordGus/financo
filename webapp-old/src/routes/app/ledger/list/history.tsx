import { Transaction } from "@/types/Transaction"
import { ListFilters } from "@api/transactions"
import { Throbber } from "@components/Throbber"
import { CardContent } from "@components/ui/card"
import { UseMutationResult } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { TransactionTable } from "./table"

interface Props {
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | NonNullable<unknown>>>
}

export function TransactionsHistory({ mutation: { data, isPending, isError, error }, setOpen, setTransaction }: Props) {
    if (isError) throw error

    if (isPending) return (
        <CardContent className="flex flex-row gap-4 justify-center items-center py-4">
            <Throbber variant="small" /> <p>Fetching</p>
        </CardContent>
    )

    if (isEmpty(data) || isNil(data)) return (
        <CardContent className="flex flex-row gap-4 justify-center items-center py-4">
            <p>There's no <span className="font-bold">Transactions</span> for the given filters</p>
        </CardContent>
    )

    return (
        <TransactionTable
            transactions={data}
            sortByFn={(a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)}
            groupByFn={({ executedAt }) => executedAt!}
            setOpen={setOpen}
            setTransaction={setTransaction}
            withUpcoming={true}
        />
    )
}
