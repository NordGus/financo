import { useQuery } from "@tanstack/react-query";

import { staleTimeDefault } from "@queries/Client";
import {
    getAvailableCreditSummary,
    getCapitalSummary,
    getDebtsSummary,
    getNetWorthSummary
} from "@api/summary";

import { CardSummary } from "@components/card";

export function SummaryCapital() {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'capital'],
        queryFn: getCapitalSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary title="Capital" balances={balances || []} />
}

export function SummaryDebt() {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'debts'],
        queryFn: getDebtsSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary title="Debt" balances={balances || []} />
}

export function SummaryNetWorth() {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'net_worth'],
        queryFn: getNetWorthSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary title="Net Worth" balances={balances || []} />
}

export function SummaryAvailableCredit() {
    const { data: balances, isFetching, isError, error } = useQuery({
        queryKey: ['summary', 'available_credit'],
        queryFn: getAvailableCreditSummary,
        staleTime: staleTimeDefault
    })

    if (isError) throw error
    if (isFetching) return null

    return <CardSummary title="Available Credit" balances={balances || []} />
}