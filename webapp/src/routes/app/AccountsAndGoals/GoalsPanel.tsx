import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { getArchivedGoals, getGoals, getReachedGoals } from "@api/goals"
import { staleTimeDefault } from "@queries/Client"

import Panel from "@components/Panel"
import WithNavigation from "@components/goal/preview/WithNavigation"

type Queries = "active" | "archived" | "reached"

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

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")

    return (
        <Panel.WithTabs
            grow={true}
            className={className}
            loading={
                {
                    active: activeQuery.isFetching,
                    archived: archivedQuery.isFetching,
                    reached: reachedQuery.isFetching
                }[currentQuery] || false
            }
            header={
                <>
                    <Panel.Components.Title text="Goals" grow={true} />
                    <Panel.Components.ActionLink to={"/accounts"} text="Add" />
                </>
            }
            tabs={[
                {
                    key: "goals:tab:active",
                    text: "Active",
                    active: currentQuery === "active",
                    onClick: () => setCurrentQuery("active")
                },
                {
                    key: "goals:tab:archived",
                    text: "Archived",
                    active: currentQuery === "archived",
                    onClick: () => setCurrentQuery("archived")
                },
                {
                    key: "goals:tab:reached",
                    text: "Reached",
                    active: currentQuery === "reached",
                    onClick: () => setCurrentQuery("reached")
                },
            ]}
            contents={
                {
                    active: activeQuery.data?.length === 0 ? null : activeQuery.data?.
                        map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />),
                    archived: archivedQuery.data?.length === 0 ? null : archivedQuery.data?.
                        map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />),
                    reached: reachedQuery.data?.length === 0 ? null : reachedQuery.data?.
                        map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />)
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Goals</span> active in the system</p>
                        <Link to={`/accounts`} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Goals</span> archived in the system</p>
                    </div>,
                    reached: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Goals</span> reached in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}