import { Transaction } from "@/types/Transaction"
import { PendingFilters } from "@api/transactions"
import { Throbber } from "@components/Throbber"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion"
import { Card, CardContent, CardDescription } from "@components/ui/card"
import { UseMutationResult } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { TransactionTable } from "./table"

interface Props {
    mutation: UseMutationResult<Transaction[], Error, PendingFilters, unknown>
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | NonNullable<unknown>>>
}

export function TransactionsPending({ mutation: { data, isPending, isError, error }, setOpen, setTransaction }: Props) {
    if (isError) throw error

    if (isPending) return (
        <Card className="mb-4 overflow-clip">
            <CardContent className="flex flex-row gap-4 justify-center items-center py-4">
                <Throbber variant="small" /> <p>Fetching</p>
            </CardContent>
        </Card>
    )

    if (isEmpty(data) || isNil(data)) return null

    return (
        <Card className="mb-4 overflow-clip">
            <AccordionItem value="pending" className="border-none">
                <AccordionTrigger className="px-5">Pending</AccordionTrigger>
                <AccordionContent className="pb-0">
                    <CardContent>
                        <CardDescription>
                            Transactions with unknown Execution Date. Please check that is no longer the case and update the transactions to reflect this
                        </CardDescription>
                    </CardContent>
                    <TransactionTable
                        transactions={data}
                        sortByFn={(a, b) => Date.parse(a.issuedAt) - Date.parse(b.issuedAt)}
                        groupByFn={({ issuedAt }) => issuedAt}
                        setOpen={setOpen}
                        setTransaction={setTransaction}
                        withUpcoming={false}
                    />
                </AccordionContent>
            </AccordionItem>
        </Card>
    )
}
