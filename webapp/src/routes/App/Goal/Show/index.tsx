import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

import { goalQuery } from "@queries/goals"

import Panel from "@components/Panel"

export default function Show() {
    const { id } = useParams()
    const queryOptions = useMemo(() => goalQuery(id!), [id!])
    const query = useQuery(queryOptions)

    return (
        <Panel.WithLoadingIndicator
            className="max-h-[95dvh] min-h-[30dvh]"
            grow={true}
            loading={query.isFetching}
            header={
                <>
                    <span className="flex-grow content-['']"></span>
                    <Panel.Components.ActionLink to="/accounts" text="Close" />
                </>
            }
            contents={<span>{query.data?.name}</span>}
        />
    )
}