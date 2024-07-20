import { PropsWithChildren, useMemo } from "react"
import { isEqual } from "lodash";

import { UpcomingFilters } from "@api/transactions"

import Panel from "@components/Panel";
import moment from "moment";

interface FiltersProps {
    filters: UpcomingFilters
    setFilters: (filters: UpcomingFilters) => void
    onClear: () => void
}

function Line({ children }: PropsWithChildren) {
    return <div
        className="flex justify-between items-stretch min-h-10 h-10 max-h-10 divide-x dark:divide-neutral-800"
    >
        {children}
    </div>
}

export default function Filters({ filters, setFilters, onClear }: FiltersProps) {
    const defaultFilters = useMemo(() => filters, [])
    const filtersHasChanged = useMemo(() => !isEqual(filters, defaultFilters), [filters])

    return (
        <div className="flex flex-col divide-y dark:divide-neutral-800">
            {filtersHasChanged && (
                <Line>
                    <span className="flex-grow content-['']"></span>
                    <Panel.Components.ActionButton
                        text="Clear All Filters"
                        active={false}
                        onClick={onClear}
                    />
                </Line>
            )}
            <Line>
                {Object.entries(filters).map(([key, filter]) => (
                    <div className="flex-grow flex justify-between items-center px-2">
                        <span>{key}</span>
                        <span>{filter}</span>
                    </div>
                ))}
            </Line>
            <Line>
                <Panel.Components.ActionButton
                    text="Change Filter"
                    active={false}
                    onClick={() => setFilters({ ...filters, executedUntil: moment().format('YYYY-MM-DD'), account: ['1'] })}
                />
            </Line>
        </div>
    )
}