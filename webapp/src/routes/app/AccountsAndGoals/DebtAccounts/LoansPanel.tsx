import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { staleTimeDefault } from "../../../../queyClient"
import {
    getArchivedDebtLoanAccounts,
    getDebtLoanAccounts
} from "../../../../api/accounts"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface LoansPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['accounts', 'debt', 'loans', 'active'],
    queryFn: getDebtLoanAccounts,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['accounts', 'debt', 'loans', 'archived'],
    queryFn: getArchivedDebtLoanAccounts,
    staleTime: staleTimeDefault
}

export default function LoansPanel({ className }: LoansPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel
            className={className}
            loading={
                {
                    active: false,
                    archived: false
                }[currentQuery] || false
            }
            header={
                <>
                    <Title text="Loans" grow={true} />
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
                    active: activeQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />),
                    archived: archivedQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />),
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Loans</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Loans</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}