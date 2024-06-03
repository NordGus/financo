import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { activeAccountsQueries, archivedAccountsQueries } from "@queries/accounts"

import Panel from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface CreditLinesPanelProps {
    className?: string
}

export default function CreditLinesPanel({ className }: CreditLinesPanelProps) {
    const activeQuery = useQuery(activeAccountsQueries.debt.credit)
    const archivedQuery = useQuery(archivedAccountsQueries.debt.credit)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

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
                    <Panel.Components.Title text="Credit Lines" grow={true} />
                    <Panel.Components.ActionButton
                        text={
                            {
                                active: "Show Archived",
                                archived: "Show Active"
                            }[currentQuery] || ""
                        }
                        onClick={() => {
                            setCurrentQuery(currentQuery === "active" ? "archived" : "active")
                        }}
                        active={false}
                    />
                    <Panel.Components.ActionLink to="/accounts/new" text="Add" />
                </>
            }
            contents={
                {
                    active: activeQuery.data?.length === 0 ? null : activeQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />),
                    archived: archivedQuery.data?.length === 0 ? null : archivedQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />)
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Credit Lines</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Credit Lines</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}