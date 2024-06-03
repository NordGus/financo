import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { activeGoalsQuery, archivedGoalsQuery } from "@queries/goals"

import Panel from "@components/Panel"
import Preview from "@components/goal/Preview"

type Queries = "active" | "archived"

interface AdministrationPanelProps {
    className?: string
}

export default function AdministrationPanel({ className }: AdministrationPanelProps) {
    const activeQuery = useQuery(activeGoalsQuery)
    const archivedQuery = useQuery(archivedGoalsQuery)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")
    const newGoalPath = "/accounts/goals/new"

    return (
        <Panel.WithLoadingIndicator
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
                    <Panel.Components.Title text="Goals" grow={true} />
                    <Panel.Components.ActionButton
                        text={
                            {
                                active: "Show Archived",
                                archived: "Show Active"
                            }[currentQuery] || ""
                        }
                        onClick={() => {
                            setCurrentQuery(currentQuery === "active" ? "archived" : "active")
                        }}
                        active={false}
                    />
                    <Panel.Components.ActionLink to={newGoalPath} text="Add" />
                </>
            }
            contents={
                {
                    active: activeQuery.data?.length === 0 ? null : activeQuery.data?.
                        map((goal) => <Preview.WithNavigation
                            key={`goal:${goal.id}`}
                            goal={goal} />),
                    archived: archivedQuery.data?.length === 0 ? null : archivedQuery.data?.
                        map((goal) => <Preview.WithNavigation
                            key={`goal:${goal.id}`}
                            goal={goal} />)
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Goals</span> active in the system</p>
                        <Link to={newGoalPath} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Savings Goals</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}