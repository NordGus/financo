import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { transactionQuery } from "@queries/transactions";

import Panel from "@components/Panel";
import Throbber from "@components/Throbber";

export default function Show() {
    const { id } = useParams()
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
                <Panel.Components.ActionLink to="/books" text="Close" />
            </>}
        >
            <span className="flex-grow flex justify-center items-center">{transaction?.id}</span>
        </Panel.Base>
    )
}