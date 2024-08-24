import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
    LoaderFunctionArgs,
    Params,
    redirect,
    useLoaderData
} from "react-router-dom"

import { Kind } from "@/types/Account"

import { accountQueryOptions } from "@queries/accounts"
import { deleteAccount } from "@api/accounts"

import isExternalAccount from "@helpers/account/isExternalAccount"
import isCapitalAccount from "@helpers/account/isCapitalAccount"
import isDebtAccount from "@helpers/account/isDebtAccount"
import { cn } from "@/lib/utils"

import { CardSummary } from "@components/card"
import { toast } from "@components/ui/use-toast"
import {
    SummaryBalanceForAccount,
    SummaryDailyBalanceForAccount,
    SummaryDebtForAccount,
    SummaryPaidForAccount,
} from "@components/widgets/summaries"

import { Transactions } from "./transactions"
import { UpdateAccountForm } from "./form"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    const account = await queryClient.ensureQueryData(accountQueryOptions(id))

    return { id: account.id, breadcrumb: "Edit Account" }
}

export const action = (queryClient: QueryClient) => async ({
    request, params
}: { request: Request, params: Params }) => {
    if (!params.id) throw new Error('No account ID provided')
    const id = Number(params.id)

    switch (request.method.toLowerCase()) {
        case "delete":
            const deleted = await deleteAccount(id)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["accounts"] }),
                queryClient.invalidateQueries({ queryKey: ["transactions"] })
            ])

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

    const { data: account, isFetching, isError, error } = useSuspenseQuery(accountQueryOptions(id))

    if (isError) throw error

    return (
        <div className="grid grid-cols-4 grid-rows-[fit-content_minmax(0,_1fr)] gap-4">
            {
                isCapitalAccount(account.kind) && (
                    <SummaryBalanceForAccount
                        key={`summary:account:${id}:balance`}
                        id={account.id}
                        className={cn("grow", isCapitalAccount(account.kind) && "col-span-4")}
                    />
                )
            }
            {
                isDebtAccount(account.kind) && (
                    <SummaryPaidForAccount
                        color={account.color}
                        paid={account.capital + account.balance}
                        amount={account.capital}
                        currency={account.currency}
                        kind={account.kind}
                    />
                )
            }
            {
                isDebtAccount(account.kind) && (
                    <SummaryDebtForAccount
                        key={`summary:account:${id}:debt`}
                        id={account.id}
                        className="grow col-span-2"
                    />
                )
            }
            {
                isDebtAccount(account.kind) && (
                    <CardSummary
                        key={`summary:account:${id}:capital`}
                        title={account.kind === Kind.DebtCredit ? "Credit" : "Amount"}
                        summaries={
                            account.kind === Kind.DebtCredit
                                ? [{ amount: account.capital, currency: account.currency, series: null }]
                                : [{ amount: -account.capital, currency: account.currency, series: null }]
                        }
                        className="grow"
                    />
                )
            }
            {
                isExternalAccount(account.kind) && (
                    <SummaryDailyBalanceForAccount
                        key={`summary:account:${id}:dailyBalance`}
                        id={account.id}
                        className={cn("grow", isExternalAccount(account.kind) && "col-span-4")}
                    />
                )
            }
            <UpdateAccountForm account={account} loading={isFetching} className="col-span-2" />
            <Transactions account={account} className="col-span-2" />
        </div >
    )
}