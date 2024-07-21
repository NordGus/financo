import { ListFilters } from "@api/transactions";

import Action from "@components/Action";
import Control from "@components/Control";

interface HistoryFiltersProps {
    filters: ListFilters,
    setFilters: React.Dispatch<React.SetStateAction<ListFilters>>,
    onClose: React.MouseEventHandler<HTMLSpanElement>,
    onApplyFilters: () => void,
    onClearFilters: () => void
}

interface InputDateProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
> {
    id: string,
    name: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

function InputDate({ name, id, value, onChange }: InputDateProps) {
    return <input
        type="date"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded shadow"
    />
}

export default function History({
    filters,
    setFilters,
    onClose,
    onApplyFilters,
    onClearFilters
}: HistoryFiltersProps) {
    return (
        <div
            className="h-full grid grid-rows-[minmax(0,_min-content)_minmax(0,_1fr)] gap-2"
        >
            <div className="flex items-stretch min-h-10 h-10 max-h-10 gap-2">
                <Action.Default onClick={onClose}>
                    Close
                </Action.Default>
                <span className="contents-[''] flex-grow"></span>
                <Action.Default onClick={onClearFilters}>
                    Clear
                </Action.Default>
                <Action.Info onClick={onApplyFilters}>
                    Apply
                </Action.Info>
            </div>
            <div className="h-full grid grid-cols-4 gap-2 items-stretch text-neutral-950 dark:text-neutral-50">
                <div className="grid grid-cols-2 items-stretch justify-stretch gap-2">
                    <Control
                        className="col-span-2"
                        onClick={() => { }}
                    >
                        <p>Select Range</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Forever</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Select Day</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Week</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Today</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Year</p>
                    </Control>
                    <Control
                        onClick={() => { }}
                    >
                        <p>Month</p>
                    </Control>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <label htmlFor="executed_at_from">From</label>
                    <InputDate
                        name="executed_at[from]"
                        id="executed_at_from"
                        value={filters.executedFrom}
                        onChange={(event) => {
                            setFilters({ ...filters, executedFrom: event.target.value })
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <label htmlFor="executed_at_to">To</label>
                    <InputDate
                        name="executed_at[to]"
                        id="executed_at_to"
                        value={filters.executedUntil}
                        onChange={(event) => {
                            setFilters({ ...filters, executedUntil: event.target.value })
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <span>Account</span>
                </div>
            </div>
        </div>
    )
}