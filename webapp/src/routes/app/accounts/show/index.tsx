import { cn } from "@/lib/utils"
import { Kind } from "@/types/Account"
import { CardSummary } from "@components/card"
import {
    SummaryBalanceForAccount,
    SummaryDailyBalanceForAccount,
    SummaryDebtForAccount,
    SummaryPaidForAccount,
} from "@components/widgets/summaries"
import isCapitalAccount from "@helpers/account/isCapitalAccount"
import isDebtAccount from "@helpers/account/isDebtAccount"
import isExternalAccount from "@helpers/account/isExternalAccount"
import { accountQueryOptions } from "@queries/accounts"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLoaderData } from "react-router-dom"
import { UpdateAccountForm } from "./form"
import { loader } from "./loader"
import { Transactions } from "./transactions"

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