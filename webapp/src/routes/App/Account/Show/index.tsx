import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import { CardSummary } from "@components/card"
import { TransactionHistory, PendingTransactions, UpcomingTransactions } from "./transactions"
import { AccountDetails } from "./account"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
        throw new Error('No account ID provided')
    }

    await queryClient.ensureQueryData(accountQuery(params.id))

    return { id: params.id, breadcrumb: "Edit Account" }
}

// [ ] TODO: read about actions to implement account persistance.
export const action = () => { }

export default function Show() {
    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const { data: account, isFetching, isError, error } = useSuspenseQuery(accountQuery(id))

    if (isError) throw error

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <AccountDetails loading={isFetching} account={account} />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-stretch">
                    <CardSummary
                        key="account:balance"
                        title="Balance"
                        balances={[{ amount: account.balance, currency: account.currency }]}
                        className="grow"
                    />
                    <CardSummary
                        key="account:balance:2"
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