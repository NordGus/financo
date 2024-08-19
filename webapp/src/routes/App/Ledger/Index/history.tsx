import { Dispatch, SetStateAction } from "react"
import { UseMutationResult } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"

import Transaction from "@/types/Transaction"

import { ListFilters } from "@api/transactions"

import { CardContent, CardFooter, CardHeader } from "@components/ui/card"
import { Throbber } from "@components/Throbber"
import { TransactionTable } from "./table"

interface Props {
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

export function TransactionsHistory({ mutation: { data, isPending, isError, error }, setOpen, setTransaction }: Props) {
    if (isError) throw error

    if (isPending) return (
        <>
            <CardHeader></CardHeader>
            <CardContent className="flex flex-row gap-4 justify-center items-center">
                <Throbber /> <p>Fetching</p>
            </CardContent>
            <CardFooter></CardFooter>
        </>
    )

    if (isEmpty(data) || isNil(data)) return (
        <>
            <CardHeader></CardHeader>
            <CardContent className="flex flex-row gap-4 justify-center items-center">
                <p>There's no <span className="font-bold">Transactions</span> for the given filters</p>
            </CardContent>
            <CardFooter></CardFooter>
        </>
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
