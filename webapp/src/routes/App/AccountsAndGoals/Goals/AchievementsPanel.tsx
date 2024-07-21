import { useQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"

import { reachedGoalsQuery } from "@queries/goals"

import Panel from "@components/Panel"
import Preview from "@/components/goal/Preview"

interface AchievementsPanelProps {
    className?: string
}

export default function AchievementsPanel({ className }: AchievementsPanelProps) {
    const query = useQuery(reachedGoalsQuery)

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            loading={query.isFetching}
            header={<Panel.Components.Title text="Savings Achievements" grow={true} />}
            contents={
                isEmpty(query.data) || isNil(query.data)
                    ? null
                    : query.data.map((goal) => <Preview.ForList
                        key={`goal:${goal.id}`}
                        goal={goal}
                    />)
            }
            noContentsMessage={
                <div className="flex flex-col justify-center items-center gap-2">
                    <p>Keep working on your <span className="font-bold">Savings Goals</span></p>
                    <p className="text-sm">A thousand kilometer journey starts with a single step</p>
                </div>
            }
        />
    )
}