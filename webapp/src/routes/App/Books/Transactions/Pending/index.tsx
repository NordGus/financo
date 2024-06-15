import { transactionsQueries } from "@queries/transactions";
import { useQuery } from "@tanstack/react-query";

import Panel from "@components/Panel";
import Preview from "@components/transaction/Preview";

interface PendingProps {
    className: string
}

export default function Pending({ className }: PendingProps) {
    const query = useQuery(transactionsQueries.pending)

    return (
        <Panel.WithLoadingIndicator
            className={className}
            loading={query.isFetching}
            header={<Panel.Components.Title grow={true} text="Pending Transactions" />}
            contents={
                (query.data?.length === 0 || !query.data)
                    ? null
                    : query.data.map((transaction) => (
                        <Preview.WithNavigation
                            key={`transaction:pending:${transaction.id}`}
                            transaction={transaction}
                        />
                    ))
            }
        />
    )
}