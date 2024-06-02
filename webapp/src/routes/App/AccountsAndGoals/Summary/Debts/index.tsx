import { useQuery } from "@tanstack/react-query"

import { staleTimeDefault } from "@queries/Client"
import { getDebtsSummary } from "@api/summary"

import SummaryCard from "@components/SummaryCard"

const queryOptions = {
    queryKey: ['summary', 'debts'],
    queryFn: getDebtsSummary,
    staleTime: staleTimeDefault
}

export default function Debts() {
    const query = useQuery(queryOptions)

    return <SummaryCard name="Debts" loading={query.isFetching} summaries={query.data || []} />
}