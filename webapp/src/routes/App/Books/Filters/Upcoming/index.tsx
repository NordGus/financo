import { useQuery } from "@tanstack/react-query"
import { isEmpty, isNil, sortBy } from "lodash"

import { Preview } from "@/types/Account"

import { UpcomingFilters } from "@api/transactions"
import { accountsForOtherContext } from "@queries/accounts"

import Action from "@components/Action"
import Control from "@components/Control"
import Input from "@components/Input"
import Throbber from "@components/Throbber"
import ForFilters from "@components/Account/Preview/ForFilters"

interface UpcomingFiltersProps {
    filters: UpcomingFilters,
    setFilters: React.Dispatch<React.SetStateAction<UpcomingFilters>>,
    onClose: React.MouseEventHandler<HTMLSpanElement>,
    onApplyFilters: () => void,
    onClearFilters: () => void
}

function Accounts({
    filters: { executedUntil, account: selected = [] }, setFilters, data
}: {
    filters: UpcomingFilters,
    setFilters: React.Dispatch<React.SetStateAction<UpcomingFilters>>,
    data: Preview[] | null | undefined
}) {
    if (isEmpty(data) || isNil(data)) return null

    const accounts = sortBy(data, [({ kind }) => kind])

    return accounts.map((account) => <ForFilters
        key={`account:filter:${account.id}`}
        account={account}
        active={selected.includes(account.id)}
        onClick={() => {
            if (selected.includes(account.id)) {
                setFilters({
                    executedUntil, account: [...selected.filter((id) => id !== account.id)]
                })
            } else {
                setFilters({ executedUntil, account: [...selected, account.id] })
            }
        }}
    />)
}

export default function Upcoming({
    filters,
    setFilters,
    onClose,
    onApplyFilters,
    onClearFilters
}: UpcomingFiltersProps) {
    const accountsQuery = useQuery(accountsForOtherContext)

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
                <div className="flex flex-col gap-2 justify-center col-span-2">
                    <label htmlFor="executed_at_to">To</label>
                    <Input.Base
                        type="date"
                        name="executed_at[to]"
                        id="executed_at_to"
                        value={filters.executedUntil || ""}
                        onChange={({ target: { value } }) => {
                            setFilters({ ...filters, executedUntil: value })
                        }}
                    />
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex gap-2 justify-start flex-wrap">
                        {
                            accountsQuery.isFetching
                                ? <div className="flex gap-1 items-center justify-center">
                                    <Throbber variant="small" />
                                    <p>Fetching</p>
                                </div>
                                : <Accounts
                                    data={accountsQuery.data}
                                    filters={filters}
                                    setFilters={setFilters}
                                />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}