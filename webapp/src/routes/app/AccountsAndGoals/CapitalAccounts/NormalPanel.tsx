import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import {
    getArchivedCapitalNormalAccounts,
    getCapitalNormalAccounts
} from "../../../../api/accounts"
import { staleTimeDefault } from "../../../../queyClient"

import Panel, { ActionButton, ActionLink, Title } from "../../../../components/Panel"
import WithNavigation from "../../../../components/account/preview/WithNavigation"

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
            loading={currentQuery === "active" ? activeQuery.isFetching : archivedQuery.isFetching}
            className={className}
        >
            {
                currentQuery === "active"
                    ? activeQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />)
                    : archivedQuery.data?.
                        map((acc) => <WithNavigation key={`account:${acc.id}`} account={acc} />)
            }
        </Panel>
    )
}