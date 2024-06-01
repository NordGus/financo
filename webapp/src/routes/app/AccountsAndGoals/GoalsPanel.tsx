import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getArchivedGoals, getGoals, getReachedGoals } from "../../../api/goals"
import { staleTimeDefault } from "../../../queyClient"

import Panel, { ActionButton, ActionLink, Title } from "@components/Panel"
import WithNavigation from "@components/goal/preview/WithNavigation"
import { Link } from "react-router-dom"

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
        <Panel
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
                    <Title text="Goals" grow={true} />
                    <ActionLink to={"/accounts"} text="Add" />
                </>
            }
            tabs={
                <>
                    {
                        ([
                            { text: "Active", query: "active" },
                            { text: "Archived", query: "archived" },
                            { text: "Active", query: "reached" },
                        ] as { text: string, query: Queries }[]).map(({ text, query }) => (
                            <ActionButton
                                text={text}
                                onClick={() => setCurrentQuery(query)}
                                active={currentQuery === query}
                                grow={true}
                            />
                        ))
                    }
                </>
            }
            contents={
                {
                    active: activeQuery.data?.
                        map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />),
                    archived: archivedQuery.data?.
                        map((goal) => <WithNavigation key={`goal:${goal.id}`} goal={goal} />),
                    reached: reachedQuery.data?.
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