import { useQuery } from "@tanstack/react-query";

import { staleTimeDefault } from "@queries/Client";
import {
    getAvailableCreditSummary,
    getBalanceForAccountSummary,
    getCapitalSummary,
    getDebtsSummary,
    getNetWorthSummary,
    getPaidForAccountSummary
} from "@api/summary";

import { CardSummary } from "@components/card";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { cn } from "@/lib/utils";
import { Currency } from "dinero.js";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";
import { Kind } from "@/types/Account";

export function SummaryCapital({ className }: { className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'capital'],
        queryFn: getCapitalSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Capital" summaries={balances || []} />
}

export function SummaryDebt({ className }: { className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'debts'],
        queryFn: getDebtsSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Debt" summaries={balances || []} />
}

export function SummaryNetWorth({ className }: { className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'net_worth'],
        queryFn: getNetWorthSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Net Worth" summaries={balances || []} />
}

export function SummaryAvailableCredit({ className }: { className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'available_credit'],
        queryFn: getAvailableCreditSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Available Credit" summaries={balances || []} />
}

export function SummaryBalanceForAccount({ id, className }: { id: number, className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'balance', 'account', id],
        queryFn: () => getBalanceForAccountSummary(id),
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Balance" summaries={balances || []} />
}

export function SummaryDebtForAccount({ id, className }: { id: number, className?: string }) {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'debt', 'account', id],
        queryFn: () => getPaidForAccountSummary(id),
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary className={className} title="Debt" summaries={balances || []} />
}

export function SummaryPaidForAccount({
    color, amount, paid, currency, kind, className
}: { color: string, amount: number, paid: number, currency: Currency, kind: Kind, className?: string }) {
    // const { data: balances, isFetching, isError, error } = useQuery({
    //     queryKey: ['summary', 'debt', 'account', id],
    //     queryFn: () => getPaidForAccountSummary(id),
    //     staleTime: staleTimeDefault
    // })

    // if (isError) throw error
    // if (isFetching) return null

    return <Card className={className}>
        <CardHeader className="space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
                {
                    kind === Kind.DebtCredit
                        ? "Available Credit"
                        : "Paid"
                }
            </CardTitle>
            <div className={cn("text-2xl font-bold", currencyAmountColor(paid, false))}>
                {currencyAmountToHuman(paid, currency)}
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <ChartContainer
                config={{
                    move: {
                        label: "Move",
                        color: "hsl(var(--chart-1))",
                    },
                }}
                className="mx-auto w-full max-w-[80%] min-h-[150px] h-[150px] max-h-[150px]"
            >
                <RadialBarChart
                    margin={{ left: -10, right: -10, top: -10, bottom: -10 }}
                    data={[{ paid: (paid / amount) * 100, fill: color }]}
                    innerRadius="50%"
                    barSize={30}
                    startAngle={90}
                    endAngle={450}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        dataKey="value"
                        tick={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <RadialBar dataKey="paid" background cornerRadius={5} />
                </RadialBarChart>
            </ChartContainer>
        </CardContent>
    </Card>
}