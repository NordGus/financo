import { Kind } from "@/types/achievable"
import { SavingsGoal } from "@/types/savings-goal"
import { Throbber } from "@components/Throbber"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { achievedAchievements } from "@queries/my-journey"
import { useSuspenseQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"
import { useLoaderData, useOutletContext } from "react-router-dom"
import { AchievementsOutletContext } from "../layout"
import { loader } from "./loader"

export default function MyJourney() {
    const { onSetSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    const { achievements } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    const { data, isFetching, isError, error } = useSuspenseQuery({
        ...achievedAchievements,
        initialData: achievements,
    })

    if (isError) throw error

    if ((isEmpty(data) || isNil(data)) && isFetching) {
        return (
            <div className="m-auto">
                <Throbber />
            </div>
        )
    }

    if (isEmpty(data) || isNil(data)) {
        return (
            <div>
                There's no achievements yet
            </div>
        )
    }

    return (
        <div>
            {
                data.map((achievement) => {
                    switch (achievement.kind) {
                        case Kind.SavingsGoal:
                            return <SavingsGoalEntry
                                key={achievement.id}
                                goal={achievement}
                                onSetSavingsGoal={onSetSavingsGoal}
                            />
                        default:
                            throw Error(`invalid achievable kind: ${achievement.kind}`)
                    }
                })
            }
        </div>
    )
}

interface SavingsGoalEntryProps {
    goal: SavingsGoal,
    onSetSavingsGoal: (goal: SavingsGoal) => void
}

function SavingsGoalEntry({ goal }: SavingsGoalEntryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {goal.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{goal.description}</p>
            </CardContent>
        </Card>
    )
}