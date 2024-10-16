import { Kind } from "@/types/achievable"
import { SavingsGoal } from "@/types/savings-goal"
import { getAchieved } from "@api/my-journey"
import { Throbber } from "@components/Throbber"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { staleTimeDefault } from "@queries/client"
import { useQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"

export default function MyJourney() {
    // const { onSetSavingsGoal } = useOutletContext<AchievementsOutletContext>()
    // const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    const { data, isFetching, isError, error } = useQuery({
        queryKey: ["my-journey", "achievements"],
        queryFn: getAchieved,
        staleTime: staleTimeDefault,
    })

    if (isError) throw error

    if (isFetching) {
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
                            return <SavingsGoalEntry key={achievement.id} goal={achievement} />
                        default:
                            throw Error(`invalid achievable kind: ${achievement.kind}`)
                    }
                })
            }
        </div>
    )
}

interface SavingsGoalEntryProps {
    goal: SavingsGoal
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