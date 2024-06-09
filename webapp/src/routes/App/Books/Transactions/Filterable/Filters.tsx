import { TransactionsFilters } from "@api/transactions"

interface FiltersProps {
    filters: TransactionsFilters
    setFilters: (filters: TransactionsFilters) => void
}

export default function Filters({ filters, setFilters }: FiltersProps) {
    console.log(filters, setFilters)

    return (
        <form onSubmit={(event) => event.preventDefault()}>
            filters
        </form>
    )
}