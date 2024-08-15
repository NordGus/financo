import { LoaderFunction, LoaderFunctionArgs, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { isEmpty, isNil } from "lodash";
import moment from "moment";

import Transaction from "@/types/Transaction";

import {
    getPendingTransactions,
    getUpcomingTransactions,
    ListFilters,
    PendingFilters,
    UpcomingFilters
} from "@api/transactions";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { Throbber } from "@components/Throbber";
import { TransactionsHistory } from "./history";
import { TransactionsPending } from "./pending"
import { TransactionsUpcoming } from "./upcoming";

interface OutletContext {
    filters: ListFilters
    setOpen: Dispatch<SetStateAction<boolean>>
    setTransaction: Dispatch<SetStateAction<Transaction | {}>>
}

export function loader(_queryClient: QueryClient): LoaderFunction {
    return async (_props: LoaderFunctionArgs) => {
        return {}
    }
}

export default function Index() {
    const { filters, setOpen, setTransaction } = useOutletContext<OutletContext>()

    const pendingTransactions = useMutation({
        mutationKey: ['transactions', 'pending'],
        mutationFn: (filters: PendingFilters) => getPendingTransactions(filters)()
    })

    const upcomingTransactions = useMutation({
        mutationKey: ['transactions', 'upcoming'],
        mutationFn: (filters: UpcomingFilters) => getUpcomingTransactions(filters)()
    })

    useEffect(() => pendingTransactions.mutate({ account: filters.account }), [filters])
    useEffect(() => {
        upcomingTransactions.mutate({
            executedUntil: moment().add({ month: 1 }).toISOString(), account: filters.account
        })
    }, [filters])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <Accordion type="multiple">
                {
                    pendingTransactions.isPending
                        ? <CardContent className="flex flex-row gap-4 justify-center items-center">
                            <Throbber /> <p>Fetching</p>
                        </CardContent>
                        : !isEmpty(pendingTransactions.data) && !isNil(pendingTransactions.data) && (
                            <AccordionItem value="upcoming">
                                <AccordionTrigger className="px-5">Upcoming</AccordionTrigger>
                                <AccordionContent>
                                    <CardContent>
                                        <CardDescription>
                                            Transactions that will become effective in the next month
                                        </CardDescription>
                                    </CardContent>
                                    <TransactionsUpcoming
                                        mutation={upcomingTransactions}
                                        setOpen={setOpen}
                                        setTransaction={setTransaction}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        )
                }
                {
                    pendingTransactions.isPending
                        ? <CardContent className="flex flex-row gap-4 justify-center items-center">
                            <Throbber /> <p>Fetching</p>
                        </CardContent>
                        : !isEmpty(pendingTransactions.data) && !isNil(pendingTransactions.data) && (
                            <AccordionItem value="pending">
                                <AccordionTrigger className="px-5">Pending</AccordionTrigger>
                                <AccordionContent>
                                    <CardContent>
                                        <CardDescription>
                                            Transactions with unknown Execution Date. Please check that is no longer the case and update the transactions to reflect this
                                        </CardDescription>
                                    </CardContent>
                                    <TransactionsPending
                                        mutation={pendingTransactions}
                                        setOpen={setOpen}
                                        setTransaction={setTransaction}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        )
                }
            </Accordion>
            <TransactionsHistory filters={filters} setOpen={setOpen} setTransaction={setTransaction} />
        </Card>
    )
}