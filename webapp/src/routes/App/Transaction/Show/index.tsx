import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { transactionQuery } from "@queries/transactions";

import Panel from "@components/Panel";
import { Throbber } from "@components/Throbber";

interface OutletContext {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Show() {
    const { id } = useParams()
    const { setOpenModal } = useOutletContext<OutletContext>()
    const queryOptions = useMemo(() => transactionQuery(id!), [id!])
    const { data: transaction, isFetching } = useQuery(queryOptions)

    return (
        <Panel.Base
            className="h-full"
            header={<>
                {
                    isFetching && <div
                        className="flex justify-center items-center py-1 px-2 gap-2"
                    >
                        <Throbber variant="small" />
                        <p>Fetching</p>
                    </div>
                }
                <span className="flex-grow content-['']"></span>
                <Panel.Components.ActionButton
                    onClick={() => setOpenModal(false)}
                    text="Close"
                    active={false}
                />
            </>}
        >
            <span className="flex-grow flex justify-center items-center">{transaction?.id}</span>
        </Panel.Base>
    )
}