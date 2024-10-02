import { Transaction } from "@/types/Transaction"
import { ListFilters } from "@api/transactions"
import { Throbber } from "@components/Throbber"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion"
import { Card, CardContent, CardDescription } from "@components/ui/card"
import { UseMutationResult } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"
import { Dispatch, SetStateAction } from "react"
import { TransactionTable } from "./table"

interface Props {
    mutation: UseMutationResult<Transaction[], Error, ListFilters, unknown>
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | NonNullable<unknown>>>
}

export function TransactionsUpcoming({
    mutation: { data, isPending, isError, error }, setOpen, setTransaction
}: Props) {
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
            <AccordionItem value="upcoming" className="border-none">
                <AccordionTrigger className="px-5">Upcoming</AccordionTrigger>
                <AccordionContent className="pb-0">
                    <CardContent>
                        <CardDescription>
                            Transactions that will become effective in the next month
                        </CardDescription>
                    </CardContent>
                    <TransactionTable
                        transactions={data}
                        sortByFn={(a, b) => Date.parse(b.executedAt!) - Date.parse(a.executedAt!)}
                        groupByFn={({ executedAt }) => executedAt!}
                        setOpen={setOpen}
                        setTransaction={setTransaction}
                        withUpcoming={false}
                    />
                </AccordionContent>
            </AccordionItem>
        </Card>
    )
}
