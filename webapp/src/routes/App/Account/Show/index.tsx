import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import { Throbber } from "@components/Throbber"
import Panel from "@components/Panel"
import { CardSummary } from "@components/card"
import { Card, CardContent } from "@components/ui/card"
import { Tabs } from "@components/ui/tabs"
import { TransactionHistory, PendingTransactions, UpcomingTransactions } from "./transactions"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
        throw new Error('No account ID provided')
    }

    await queryClient.ensureQueryData(accountQuery(params.id))

    return { id: params.id, breadcrumb: "Edit Account" }
}

export default function Show() {
    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const { data: account, isFetching, isError, error } = useSuspenseQuery(accountQuery(id))

    if (isError) throw error

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <Card>
                    <CardContent>
                        Account Form goes here
                    </CardContent>
                </Card>
            </div>
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
                <UpcomingTransactions accountID={account.id} />
                <PendingTransactions accountID={account.id} />
                <TransactionHistory accountID={account.id} />
            </div>
        </div >
    )
}