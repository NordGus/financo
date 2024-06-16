import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import Throbber from "@components/Throbber"
import Panel from "@components/Panel"
import Transactions from "./Transactions"

export default function Show() {
    const { id } = useParams()
    const queryOptions = useMemo(() => accountQuery(id!), [id!])
    const query = useQuery(queryOptions)

    return (
        <div
            className="h-full grid grid-rows-[minmax(0,_min-content)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] grid-cols-2 gap-1"
        >
            <div className="col-span-2 flex items-stretch min-h-10 h-10 max-h-10">
                <Link
                    to="/accounts"
                    className="flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50  hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    Close
                </Link>
            </div>
            <Panel.Base
                header={<>
                    {
                        query.isFetching && <div
                            className="flex justify-center items-center py-1 px-2 gap-2"
                        >
                            <Throbber variant="small" />
                            <p>Fetching</p>
                        </div>
                    }
                    <Panel.Components.Title grow={true} text="Details" />
                </>}
                className="row-span-3"
            >
                <div className="flex-grow overflow-y-auto">
                    Account Form goes here
                </div>
            </Panel.Base>
            <Panel.Clean className="">a graphic goes here</Panel.Clean>
            <Transactions
                className="row-span-2"
                accountId={id!}
            />
        </div >
    )
}