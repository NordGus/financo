import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import Panel from "@components/Panel"
import kindToHuman from "@helpers/account/kindToHuman"

export default function Show() {
    const { id: paramsID } = useParams()
    const queryOptions = useMemo(() => accountQuery(paramsID!), [paramsID])
    const query = useQuery(queryOptions)

    return (
        <Panel.WithLoadingIndicator
            className="max-h-[95dvh] min-h-[30dvh]"
            loading={query.isFetching}
            grow={true}
            header={<>
                {
                    query.isFetched && <span className="flex items-center px-4">
                        {kindToHuman(query.data!.kind)}
                    </span>
                }
                <span className="flex-grow content-['']"></span>
                <Link
                    to="/accounts"
                    className="flex items-center px-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    Close
                </Link>
            </>}
            contents={<>
                <span>{query.data?.name}</span>
            </>}
        />
    )
}