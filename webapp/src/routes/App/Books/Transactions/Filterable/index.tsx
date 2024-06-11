import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TransactionsFilters, getTransactions } from "@api/transactions";
import moment from "moment";

import Panel from "@components/Panel";
import Filters from "./Filters";

interface FilterableProps {
    className: string
}

function defaultFilters(): TransactionsFilters {
    return {
        executedFrom: moment().subtract({ months: 1 }).format('YYYY-MM-DD'),
        executedUntil: moment().format('YYYY-MM-DD')
    }
}

export default function Filterable({ className }: FilterableProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<TransactionsFilters>(defaultFilters())
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
            filters={
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    onClear={() => setFilters(defaultFilters())}
                />
            }
            showFilters={showFilters}
        />
    )
}