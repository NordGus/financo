import { useState } from "react"
import Panel, { ActionButton, ActionLink, Title } from "../../../../components/Panel"
import { useQuery } from "@tanstack/react-query"
import { getArchivedCapitalSavingsAccounts, getCapitalSavingsAccounts } from "../../../../api/accounts"
import { staleTimeDefault } from "../../../../queyClient"
import WithNavigation from "../../../../components/account/preview/WithNavigation"

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