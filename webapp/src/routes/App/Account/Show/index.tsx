import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { isEqual } from "lodash"
import {
    LoaderFunctionArgs,
    Params,
    redirect,
    useLoaderData
} from "react-router-dom"

import { staleTimeDefault } from "@queries/Client"
import { deleteAccount, getAccount } from "@api/accounts"

import { UpdateAccountForm } from "./form"

import { CardSummary } from "@components/card"
import {
    TransactionHistory,
    PendingTransactions,
    UpcomingTransactions
} from "./transactions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { cn } from "@/lib/utils"
import isCapitalAccount from "@helpers/account/isCapitalAccount"
import isDebtAccount from "@helpers/account/isDebtAccount"
import { Kind } from "@/types/Account"
import { Progress } from "@components/Progress"
import { CheckIcon } from "lucide-react"
import isExternalAccount from "@helpers/account/isExternalAccount"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) throw new Error('No account ID provided')

    const account = await queryClient.ensureQueryData(query(params.id))

    return { id: params.id, breadcrumb: account.name }
}

export const action = (queryClient: QueryClient) => async ({
    request, params: { id }
}: { request: Request, params: Params }) => {
    if (!id) throw new Error('No account ID provided')

    switch (request.method) {
        case "DELETE":
            const response = await deleteAccount(id)

            // [ ] TODO: Make more robust or use toasts
            if (!response.ok) throw new Response("", { status: 500 })

            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => {
                    return isEqual(queryKey, ["transactions", "pending", "account", id]) ||
                        isEqual(queryKey, ["transactions", "pending", "account", id]) ||
                        isEqual(queryKey, ['accounts', 'account', id])
                }
            })

            return redirect(`/accounts`)
        default:
            throw new Response("", { status: 405 })
    }
}

function query(id: string) {
    return {
        queryKey: ['accounts', 'account', id],
        queryFn: getAccount(id),
        staleTime: staleTimeDefault
    }
}

export default function Show() {
    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const { data: account, isFetching, isError, error } = useSuspenseQuery(query(id))

    if (isError) throw error

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
                    <PendingTransactions account={account} />
                </TabsContent>
                <TabsContent value="upcoming" className="m-0">
                    <UpcomingTransactions account={account} />
                </TabsContent>
                <TabsContent value="history" className="m-0 space-y-4">
                    <TransactionHistory account={account} className="flex flex-col" />
                </TabsContent>
            </Tabs>
        </div >
    )
}