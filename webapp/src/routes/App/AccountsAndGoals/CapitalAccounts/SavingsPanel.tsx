import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { activeAccountsQueries, archivedAccountsQueries } from "@queries/accounts"

import Panel from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface SavingsPanelProps {
    className?: string
}

export default function SavingsPanel({ className }: SavingsPanelProps) {
    const activeQuery = useQuery(activeAccountsQueries.capital.savings)
    const archivedQuery = useQuery(archivedAccountsQueries.capital.savings)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel.WithTabs
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
                    <Panel.Components.Title text="Savings" grow={true} />
                    <Panel.Components.ActionLink to="/accounts/new" text="Add" />
                </>
            }
            tabs={[
                {
                    key: "accounts:capital:savings:tab:active",
                    text: "Active",
                    active: currentQuery === "active",
                    onClick: () => setCurrentQuery("active")
                },
                {
                    key: "accounts:capital:savings:tab:archived",
                    text: "Archived",
                    active: currentQuery === "archived",
                    onClick: () => setCurrentQuery("archived")
                }
            ]}
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
                        <p>No <span className="font-bold">Savings Accounts</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Accounts</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}