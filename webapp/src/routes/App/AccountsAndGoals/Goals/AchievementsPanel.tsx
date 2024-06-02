import { useQuery } from "@tanstack/react-query"

import { getReachedGoals } from "@api/goals"
import { staleTimeDefault } from "@queries/Client"

import Panel from "@components/Panel"
import Preview from "@/components/goal/Preview"

interface AchievementsPanelProps {
    className?: string
}

const queryOptions = {
    queryKey: ['goals', 'reached'],
    queryFn: getReachedGoals,
    staleTime: staleTimeDefault
}

export default function AchievementsPanel({ className }: AchievementsPanelProps) {
    const query = useQuery(queryOptions)

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            loading={query.isFetching}
            header={<Panel.Components.Title text="Savings Achievements" grow={true} />}
            contents={
                query.data?.length === 0
                    ? null
                    : query.data?.map((goal) => <Preview.ForList
                        key={`goal:${goal.id}`}
                        goal={goal} />)
            }
            noContentsMessage={
                <div className="flex flex-col justify-center items-center gap-2">
                    <p>Keep working on your <span className="font-bold">Savings Goals</span></p>
                    <p>Before you knowing it, you'll have a reminder of your achievement</p>
                    <p className="text-sm">A thousand kilometer journey starts with a single step</p>
                </div>
            }
        />
    )
}