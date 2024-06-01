import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { staleTimeDefault } from "@queries/Client"
import { getArchivedDebtCreditAccounts, getDebtCreditAccounts } from "@api/accounts"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface CreditLinesPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['accounts', 'debt', 'credit', 'active'],
    queryFn: getDebtCreditAccounts,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['accounts', 'debt', 'credit', 'archived'],
    queryFn: getArchivedDebtCreditAccounts,
    staleTime: staleTimeDefault
}

export default function CreditLinesPanel({ className }: CreditLinesPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel
            className={className}
            loading={
                {
                    active: activeQuery.isFetching,
                    archived: archivedQuery.isFetching
                }[currentQuery] || false
            }
            header={
                <>
                    <Title text="Credit Lines" grow={true} />
                    <ActionLink to={"/accounts"} text="Add" />
                </>
            }
            tabs={
                <>
                    {
                        ([
                            { text: "Active", query: "active" },
                            { text: "Archived", query: "archived" }
                        ] as { text: string, query: Queries }[]).map(({ text, query }) => (
                            <ActionButton
                                key={`accounts:debt:credit:tab:${query}`}
                                text={text}
                                onClick={() => setCurrentQuery(query)}
                                grow={true}
                                active={currentQuery === query}
                            />
                        ))
                    }
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