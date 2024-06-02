import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { staleTimeDefault } from "@queries/Client"
import { getArchivedExternalExpenseAccounts, getExternalExpenseAccounts } from "@api/accounts"

import Panel from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface ExpensesPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['accounts', 'external', 'expenses', 'active'],
    queryFn: getExternalExpenseAccounts,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['accounts', 'external', 'expenses', 'archived'],
    queryFn: getArchivedExternalExpenseAccounts,
    staleTime: staleTimeDefault
}

export default function ExpensesPanel({ className }: ExpensesPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)

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
                    <Panel.Components.Title text="Expenses" grow={true} />
                    <Panel.Components.ActionLink to="/accounts/new" text="Add" />
                </>
            }
            tabs={[
                {
                    key: "accounts:external:expenses:tab:active",
                    text: "Active",
                    active: currentQuery === "active",
                    onClick: () => setCurrentQuery("active")
                },
                {
                    key: "accounts:external:expenses:tab:archived",
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
                        <p>No <span className="font-bold">Expense Sources</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Expense Sources</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}