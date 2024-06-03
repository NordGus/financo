import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import kindToHuman from "@helpers/account/kindToHuman"
import Throbber from "@components/Throbber"
import Panel from "@components/Panel"

export default function Show() {
    const { id } = useParams()
    const queryOptions = useMemo(() => accountQuery(id!), [id!])
    const query = useQuery(queryOptions)

    return (
        <Panel.Base
            className="h-full"
            header={<>
                {
                    query.isFetching && <div
                        className="flex justify-center items-center py-1 px-2 gap-2"
                    >
                        <Throbber variant="small" />
                        <p>Fetching</p>
                    </div>
                }
                {query.isFetched && <Panel.Components.Title text={kindToHuman(query.data!.kind)} />}
                <span className="flex-grow content-['']"></span>
                <Panel.Components.ActionLink to="/accounts" text="Close" />
            </>}
        >
            <div className="flex-grow grid grid-cols-2 grid-rows-3">
                <div className="row-span-3 overflow-y-auto border-r dark:border-neutral-800">
                    Account Form goes here
                </div>
                <div>
                    a graphic goes here
                </div>
                <div className="row-span-2 border-t dark:border-neutral-800">
                    transactions go here
                </div>
            </div>
        </Panel.Base>
    )
}