import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getArchivedGoals, getGoals, getReachedGoals } from "../../../api/goals"
import { staleTimeDefault } from "../../../queyClient"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/goal/preview/WithNavigation"

type Querie = "active" | "archived" | "reached"

interface GoalsPanelProps {
    className?: string
}

const activeQueryOptions = {
    queryKey: ['goals', 'active'],
    queryFn: getGoals,
    staleTime: staleTimeDefault
}

const archivedQueryOptions = {
    queryKey: ['goals', 'archived'],
    queryFn: getArchivedGoals,
    staleTime: staleTimeDefault
}

const reachedQueryOptions = {
    queryKey: ['goals', 'reached'],
    queryFn: getReachedGoals,
    staleTime: staleTimeDefault
}

export default function GoalsPanel({ className }: GoalsPanelProps) {
    const activeQuery = useQuery(activeQueryOptions)
    const archivedQuery = useQuery(archivedQueryOptions)
    const reachedQuery = useQuery(reachedQueryOptions)

    const [currentQuery, setCurrentQuery] = useState<Querie>("active")

    return (
        <Panel
            header={
                <>
                    <Title text="Goals" grow={true} />
                    <ActionLink to={"/accounts"} text="Add" />
                </>
            }
            tabs={
                <>
                    <ActionButton
                        text="Active"
                        onClick={() => setCurrentQuery("active")}
                        active={currentQuery === "active"}
                        grow={true}
                    />
                    <ActionButton
                        text="Archived"
                        onClick={() => setCurrentQuery("archived")}
                        active={currentQuery === "archived"}
                        grow={true}
                    />
                    <ActionButton
                        text="Reached"
                        onClick={() => setCurrentQuery("reached")}
                        active={currentQuery === "reached"}
                        grow={true}
                    />
                </>
            }
            className={className}
            loading={
                currentQuery === "active"
                    ? activeQuery.isFetching
                    : currentQuery === "archived"
                        ? archivedQuery.isFetching
                        : reachedQuery.isFetching
            }
        >
            {currentQuery === "active" && activeQuery.data?.
                map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />)}
            {currentQuery === "archived" && archivedQuery.data?.
                map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />)}
            {currentQuery === "reached" && reachedQuery.data?.
                map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />)}
        </Panel>
    )
}