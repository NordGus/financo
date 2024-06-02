import { useQuery } from "@tanstack/react-query"

import { staleTimeDefault } from "@queries/Client"
import { getTotalSummary } from "@api/summary"

import SummaryCard from "@components/SummaryCard"

const queryOptions = {
    queryKey: ['summary', 'total'],
    queryFn: getTotalSummary,
    staleTime: staleTimeDefault
}

export default function Total() {
    const query = useQuery(queryOptions)

    return <SummaryCard name="Total" loading={query.isFetching} summaries={query.data || []} />
}