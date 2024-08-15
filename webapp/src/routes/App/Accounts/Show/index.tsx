import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
    LoaderFunctionArgs,
    Params,
    redirect,
    useLoaderData
} from "react-router-dom"
import { CheckIcon } from "lucide-react"

import { Kind } from "@/types/Account"

import { accountQueryOptions } from "@queries/accounts"
import { deleteAccount } from "@api/accounts"

import isExternalAccount from "@helpers/account/isExternalAccount"
import isCapitalAccount from "@helpers/account/isCapitalAccount"
import isDebtAccount from "@helpers/account/isDebtAccount"
import { cn } from "@/lib/utils"

import { Progress } from "@components/Progress"
import { CardSummary } from "@components/card"
import { toast } from "@components/ui/use-toast"

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
            <Transactions account={account} className="col-span-2" />
        </div >
    )
}