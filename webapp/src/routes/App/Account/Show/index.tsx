import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom"
import { isEqual } from "lodash"

import { staleTimeDefault } from "@queries/Client"
import { deleteAccount, getAccount } from "@api/accounts"

import { UpdateAccountForm } from "./form"

import { CardSummary } from "@components/card"
import {
    TransactionHistory,
    PendingTransactions,
    UpcomingTransactions
} from "./transactions"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
        throw new Error('No account ID provided')
    }

    await queryClient.ensureQueryData(query(params.id))

    return { id: params.id, breadcrumb: "Edit Account" }
}

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: { id: string } }) => {
    switch (request.method) {
        case "DELETE":
            const response = await deleteAccount(params.id)

            if (!response.ok) throw response // [ ] TODO: Make more robust or use toasts

            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => {
                    return isEqual(queryKey, ["transactions", "pending", "account", params.id]) ||
                        isEqual(queryKey, ["transactions", "pending", "account", params.id]) ||
                        isEqual(queryKey, ['accounts', 'account', params.id])
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
        <div className="grid grid-cols-2 gap-4">
            <UpdateAccountForm account={account} loading={isFetching} />
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-stretch">
                    <CardSummary
                        title="Balance"
                        balances={[{ amount: account.balance, currency: account.currency }]}
                        className="grow"
                    />
                    <CardSummary
                        title="Balance"
                        balances={[{ amount: account.balance, currency: account.currency }]}
                        className="grow"
                    />
                </div>
                <UpcomingTransactions account={account} />
                <PendingTransactions account={account} />
                <TransactionHistory account={account} />
            </div>
        </div >
    )
}