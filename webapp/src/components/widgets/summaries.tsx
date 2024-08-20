import { useQuery } from "@tanstack/react-query";

import { staleTimeDefault } from "@queries/Client";
import {
    getAvailableCreditSummary,
    getCapitalSummary,
    getDebtsSummary,
    getNetWorthSummary
} from "@api/summary";

import { CardSummary } from "@components/card";

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