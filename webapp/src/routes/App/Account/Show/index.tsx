import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import Panel from "@components/Panel"
import kindToHuman from "@helpers/account/kindToHuman"

export default function Show() {
    const { id } = useParams()
    const queryOptions = useMemo(() => accountQuery(id!), [id!])
    const query = useQuery(queryOptions)

    return (
        <Panel.WithLoadingIndicator
            className="max-h-[95dvh] min-h-[30dvh]"
            loading={query.isFetching}
            grow={true}
            header={<>
                {query.isFetched && <Panel.Components.Title text={kindToHuman(query.data!.kind)} />}
                <span className="flex-grow content-['']"></span>
                <Panel.Components.ActionLink to="/accounts" text="Close" />
            </>}
            contents={<>
                <span>{query.data?.name}</span>
            </>}
        />
    )
}