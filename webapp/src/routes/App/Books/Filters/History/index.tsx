import { ListFilters } from "@api/transactions"

interface HistoryFiltersProps {
    filters: ListFilters,
    setFilters: React.Dispatch<React.SetStateAction<ListFilters>>,
    onCloseClick: () => void
}

export default function History({ filters, setFilters, onCloseClick }: HistoryFiltersProps) {
    return (
        <div
            className="h-full grid grid-rows-[minmax(0,_min-content)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] grid-cols-2 gap-1"
        >
            <div className="col-span-2 flex items-stretch min-h-10 h-10 max-h-10">
                <span
                    className="flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded shadow overflow-clip text-neutral-950 dark:text-neutral-50  hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    onClick={onCloseClick}
                >
                    Close
                </span>
            </div>
            <h1 className="text-2xl text-neutral-50">History Modal Filters</h1>
        </div>
    )
}