import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import {
    getArchivedCapitalNormalAccounts,
    getCapitalNormalAccounts
} from "../../../../api/accounts"
import { staleTimeDefault } from "../../../../queyClient"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/account/preview/WithNavigation"

type Queries = "active" | "archived"

interface NormalPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['accounts', 'capital', 'normal', 'active'],
    queryFn: getCapitalNormalAccounts,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['accounts', 'capital', 'normal', 'archived'],
    queryFn: getArchivedCapitalNormalAccounts,
    staleTime: staleTimeDefault
}

export default function NormalPanel({ className }: NormalPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel
            loading={currentQuery === "active" ? activeQuery.isFetching : archivedQuery.isFetching}
            className={className}
            header={
                <>
                    <Title text="Bank Accounts" grow={true} />
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
                    active: activeQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />),
                    archived: archivedQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />)
                }[currentQuery] || null
            }
            noContentsMessage={
                currentQuery === "active"
                    ? <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Bank Accounts</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>
                    : currentQuery === "archived"
                        ? <div className="flex flex-col justify-center items-center gap-2">
                            <p>No <span className="font-bold">Bank Accounts</span> archived in the system</p>
                        </div>
                        : undefined
            }
        />
    )
}