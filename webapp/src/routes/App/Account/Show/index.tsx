import { useEffect, useState } from "react"
import { QueryClient, useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { isEqual } from "lodash"
import {
    LoaderFunctionArgs,
    Params,
    redirect,
    useLoaderData
} from "react-router-dom"
import moment from "moment"
import { CheckIcon } from "lucide-react"

import { Kind } from "@/types/Account"

import {
    accountQueryOptions,
    pendingTransactionsQueryOptions,
    upcomingTransactionsQueryOptions
} from "@queries/accounts"
import { deleteAccount } from "@api/accounts"
import { getTransactions, ListFilters } from "@api/transactions"

import isExternalAccount from "@helpers/account/isExternalAccount"
import isCapitalAccount from "@helpers/account/isCapitalAccount"
import isDebtAccount from "@helpers/account/isDebtAccount"
import { cn } from "@/lib/utils"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Progress } from "@components/Progress"
import { CardSummary } from "@components/card"
import { toast } from "@components/ui/use-toast"
import { TransactionHistory, PendingTransactions, UpcomingTransactions } from "./transactions"
import { UpdateAccountForm } from "./form"

function defaultHistoryFilters(accountID: number): ListFilters {
    return {
        executedFrom: moment().startOf('month').startOf('day').toISOString(),
        executedUntil: moment().endOf('day').toISOString(),
        account: [accountID]
    }
}

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) throw new Error('No account ID provided')

    const id = Number(params.id)

    const [account] = await Promise.all([
        queryClient.ensureQueryData(accountQueryOptions(id)),
        queryClient.ensureQueryData(pendingTransactionsQueryOptions(id)),
        queryClient.ensureQueryData(upcomingTransactionsQueryOptions(id))
    ])

    return { id: account.id, breadcrumb: account.name }
}

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    switch (request.method.toLowerCase()) {
        case "delete":
            const deleted = await deleteAccount(id)

            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => {
                    return isEqual(queryKey, ["transactions", "pending", "account", id]) ||
                        isEqual(queryKey, ["transactions", "pending", "account", id]) ||
                        isEqual(queryKey, ['accounts', 'account', id])
                }
            })

            toast({
                title: "Deleted",
                description: `${deleted.name} and its children have been deleted`
            })

            return redirect(`/accounts`)
        default:
            throw new Response("", { status: 405 })
    }
}

export default function Show() {
    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const [historyFilters, setHistoryFilters] = useState<ListFilters>(defaultHistoryFilters(id))

    const { data: account, isFetching, isError, error } = useSuspenseQuery(accountQueryOptions(id))
    const pendingTransactionsQuery = useSuspenseQuery(pendingTransactionsQueryOptions(id))
    const upcomingTransactionsQuery = useSuspenseQuery(upcomingTransactionsQueryOptions(id))
    const historyTransactionsMutation = useMutation({
        mutationKey: ["transactions", "account", id],
        mutationFn: (filters: ListFilters) => getTransactions(filters)()
    })

    if (isError) throw error

    useEffect(() => {
        historyTransactionsMutation.mutate(historyFilters)
    }, [historyFilters, account.updatedAt])

    return (
        <div className="grid grid-cols-4 grid-rows-[20dvh_minmax(0,_1fr)] gap-4">
            {
                isDebtAccount(account.kind)
                    ? <Progress
                        className="h-[15dvh] w-[15dvh] m-auto text-5xl"
                        color={account.color}
                        progress={Math.abs((account.capital + account.balance) / account.capital)}
                        icon={<CheckIcon size={50} />}
                    />
                    : null
            }
            <CardSummary
                key={`summary:account:${id}:balance`}
                title={
                    isDebtAccount(account.kind)
                        ? "Debt"
                        : isExternalAccount(account.kind)
                            ? "This month's balance"
                            : "Balance"
                }
                balances={[{ amount: account.balance, currency: account.currency }]}
                className={
                    cn("grow",
                        isCapitalAccount(account.kind) && "col-span-4",
                        isExternalAccount(account.kind) && "col-span-4",
                    )
                }
            />
            {
                isDebtAccount(account.kind)
                    ? <CardSummary
                        key={`summary:account:${id}:paid`}
                        title={account.kind === Kind.DebtCredit ? "Available Credit" : "Paid"}
                        balances={[
                            {
                                amount: account.capital + account.balance,
                                currency: account.currency
                            }
                        ]}
                        className="grow"
                    />
                    : null
            }
            {
                isDebtAccount(account.kind)
                    ? <CardSummary
                        key={`summary:account:${id}:capital`}
                        title={account.kind === Kind.DebtCredit ? "Credit" : "Amount"}
                        balances={
                            account.kind === Kind.DebtCredit
                                ? [{ amount: account.capital, currency: account.currency }]
                                : [{ amount: -account.capital, currency: account.currency }]
                        }
                        className="grow"
                    />
                    : null
            }
            <UpdateAccountForm account={account} loading={isFetching} className="col-span-2" />
            <Tabs defaultValue="pending" className="flex flex-col gap-4 col-span-2">
                <TabsList>
                    <TabsTrigger value="pending" className="grow">Pending</TabsTrigger>
                    <TabsTrigger value="upcoming" className="grow">Upcoming</TabsTrigger>
                    <TabsTrigger value="history" className="grow">History</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="m-0">
                    <PendingTransactions account={account} query={pendingTransactionsQuery} />
                </TabsContent>
                <TabsContent value="upcoming" className="m-0">
                    <UpcomingTransactions account={account} query={upcomingTransactionsQuery} />
                </TabsContent>
                <TabsContent value="history" className="m-0 space-y-4">
                    <TransactionHistory
                        account={account}
                        mutation={historyTransactionsMutation}
                        filtersState={[historyFilters, setHistoryFilters]}
                        defaultFilters={() => defaultHistoryFilters(account.id)}
                    />
                </TabsContent>
            </Tabs>
        </div >
    )
}