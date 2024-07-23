import { QueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { LoaderFunctionArgs, useLoaderData, useOutletContext } from "react-router-dom"

import { accountQuery } from "@queries/accounts"

import Throbber from "@components/Throbber"
import Panel from "@components/Panel"
import Transactions from "./Transactions"
import Action from "@components/Action"

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
        throw new Error('No account ID provided')
    }

    await queryClient.ensureQueryData(accountQuery(params.id))

    return { id: params.id }
}

interface OutletContext {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Show() {
    const { setOpenModal } = useOutletContext<OutletContext>()
    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const query = useSuspenseQuery(accountQuery(id))

    if (query.error) {
        throw query.error
    }

    return (
        <div
            className="h-full grid grid-rows-[minmax(0,_min-content)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] grid-cols-4 gap-1"
        >
            <div className="col-span-4 flex items-stretch min-h-10 h-10 max-h-10">
                <Action.Default onClick={() => setOpenModal(false)}>
                    Close
                </Action.Default>
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
            <Transactions
                className="row-span-2"
                account={query.data}
            />
            <Panel.Clean className="col-span-3">a graphic goes here</Panel.Clean>
        </div >
    )
}