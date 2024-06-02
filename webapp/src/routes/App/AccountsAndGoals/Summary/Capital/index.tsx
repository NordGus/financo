import { useQuery } from "@tanstack/react-query";

import { staleTimeDefault } from "@queries/Client";
import { getCapitalSummary } from "@api/summary";

import SummaryCard from "@components/SummaryCard";

const queryOptions = {
    queryKey: ['summary', 'capital'],
    queryFn: getCapitalSummary,
    staleTime: staleTimeDefault
}

export default function Capital() {
    const query = useQuery(queryOptions)

    return <SummaryCard name="Capital" loading={query.isFetching} summaries={query.data || []} />
}