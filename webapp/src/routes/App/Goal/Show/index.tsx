import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

import { goalQuery } from "@queries/goals"

import Panel from "@components/Panel"
import Throbber from "@components/Throbber"

export default function Show() {
    const { id } = useParams()
    const queryOptions = useMemo(() => goalQuery(id!), [id!])
    const query = useQuery(queryOptions)

    return (
        <Panel.Base
            className="h-full"
            header={
                <>
                    {
                        query.isFetching
                            ? <div
                                className="flex justify-center items-center py-1 px-2 gap-2 flex-grow"
                            >
                                <Throbber variant="small" />
                                <p>Fetching</p>
                            </div>
                            : <span className="flex-grow content-['']"></span>
                    }
                    <Panel.Components.ActionLink to="/accounts" text="Close" />
                </>
            }
        >
            <div className="flex-grow grid grid-cols-2 grid-rows-3">
                <div className="row-span-3 overflow-y-auto border-r dark:border-zinc-800">
                    Goal Form goes here
                </div>
                <div>
                    a graphic goes here
                </div>
                <div className="row-span-2 border-t dark:border-zinc-800">
                    other goals go here
                </div>
            </div>
        </Panel.Base>
    )
}