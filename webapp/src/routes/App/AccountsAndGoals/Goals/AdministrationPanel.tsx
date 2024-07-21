import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"

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
                        text="Archived"
                        onClick={() => {
                            setCurrentQuery(currentQuery === "active" ? "archived" : "active")
                        }}
                        active={currentQuery === "archived"}
                    />
                    <Panel.Components.ActionLink to={newGoalPath} text="Add" />
                </>
            }
            contents={
                {
                    active: isEmpty(activeQuery.data) || isNil(activeQuery.data)
                        ? null
                        : activeQuery.data.map((goal) => <Preview.WithNavigation
                            key={`goal:${goal.id}`}
                            goal={goal}
                        />),
                    archived: isEmpty(archivedQuery.data) || isNil(archivedQuery.data)
                        ? null
                        : archivedQuery.data.map((goal) => <Preview.WithNavigation
                            key={`goal:${goal.id}`}
                            goal={goal}
                        />)
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