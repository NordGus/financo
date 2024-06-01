import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { staleTimeDefault } from "../../../../queyClient"
import {
    getArchivedCapitalSavingsAccounts,
    getCapitalSavingsAccounts
} from "../../../../api/accounts"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface SavingsPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['accounts', 'capital', 'savings', 'active'],
    queryFn: getCapitalSavingsAccounts,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['accounts', 'capital', 'savings', 'archived'],
    queryFn: getArchivedCapitalSavingsAccounts,
    staleTime: staleTimeDefault
}

export default function SavingsPanel({ className }: SavingsPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel
            loading={currentQuery === "active" ? activeQuery.isFetching : archivedQuery.isFetching}
            className={className}
            header={
                <>
                    <Title text="Savings" grow={true} />
                    <ActionLink to={"/accounts"} text="Add" />
                </>
            }
            tabs={
                <>
                    <ActionButton
                        text="Active"
                        onClick={() => setCurrentQuery("active")}
                        grow={true}
                        active={currentQuery === "active"}
                    />
                    <ActionButton
                        text="Archived"
                        onClick={() => setCurrentQuery("archived")}
                        grow={true}
                        active={currentQuery === "archived"}
                    />
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
                currentQuery === "active"
                    ? <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Accounts</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>
                    : currentQuery === "archived"
                        ? <div className="flex flex-col justify-center items-center gap-2">
                            <p>No <span className="font-bold">Savings Accounts</span> archived in the system</p>
                        </div>
                        : undefined
            }
        />
    )
}