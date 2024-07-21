import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"

import { activeAccountsQueries, archivedAccountsQueries } from "@queries/accounts"

import Panel from "@components/Panel"
import WithNavigation from "@components/Account/Preview/WithNavigation"

type Queries = "active" | "archived"

interface IncomePanelProps {
    className?: string
}

export default function IncomePanel({ className }: IncomePanelProps) {
    const activeQuery = useQuery(activeAccountsQueries.external.income)
    const archivedQuery = useQuery(archivedAccountsQueries.external.income)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")
    const newAccountPath = "/accounts/new/external_income"

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            loading={
                {
                    active: activeQuery.isFetching,
                    archived: archivedQuery.isFetching
                }[currentQuery] || false
            }
            header={
                <>
                    <Panel.Components.Title text="Income" grow={true} />
                    <Panel.Components.ActionButton
                        text="Archived"
                        onClick={() => {
                            setCurrentQuery(currentQuery === "active" ? "archived" : "active")
                        }}
                        active={currentQuery === "archived"}
                    />
                    <Panel.Components.ActionLink to={newAccountPath} text="Add" />
                </>
            }
            contents={
                {
                    active: isEmpty(activeQuery.data) || isNil(activeQuery.data)
                        ? null
                        : activeQuery.data.map((acc) => <WithNavigation
                            key={`account:${acc.id}`}
                            account={acc}
                        />),
                    archived: isEmpty(archivedQuery.data) || isNil(archivedQuery.data)
                        ? null
                        : archivedQuery.data.map((acc) => <WithNavigation
                            key={`account:${acc.id}`}
                            account={acc}
                        />)
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Income Sources</span> active in the system</p>
                        <Link to={newAccountPath} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Income Sources</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}