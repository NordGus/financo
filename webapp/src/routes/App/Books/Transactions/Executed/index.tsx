import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TransactionsFilters, getTransactions } from "@api/transactions";

import Panel from "@components/Panel";
import Filters from "./Filters";

interface ExecutedProps {
    className: string
}

export default function Executed({ className }: ExecutedProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<TransactionsFilters>({})
    const filtersMutation = useMutation({
        mutationFn: (filters: TransactionsFilters) => getTransactions(filters)()
    })

    useEffect(() => filtersMutation.mutate(filters), [filters])

    return (
        <Panel.WithFilters
            grow={true}
            className={className}
            header={<>
                <Panel.Components.Title grow={true} text="Transactions" />
                <Panel.Components.ActionButton
                    text={showFilters ? "Hide Filters" : "Show Filters"}
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
                <Panel.Components.ActionLink
                    text="Add"
                    to="/books/transactions/new"
                />
            </>}
            loading={filtersMutation.isPending}
            contents={filtersMutation.data?.map((transaction) => (<span>{transaction.id}</span>))}
            filters={<Filters filters={filters} setFilters={setFilters} />}
            showFilters={showFilters}
        />
    )
}