import { Kind, Milestone } from "@/types/achievement"
import { SavingsGoal } from "@/types/savings-goal"
import { Throbber } from "@components/Throbber"
import { Card } from "@components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@components/ui/table"
import currencyAmountToHuman from "@helpers/currencyAmountToHuman"
import { timelineQuery } from "@queries/my-journey"
import { useSuspenseQuery } from "@tanstack/react-query"
import { isEmpty, isNil } from "lodash"
import moment from "moment"
import { useLoaderData } from "react-router-dom"
import { loader } from "./loader"

export default function MyJourney() {
    const { timeline } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    const { data, isFetching, isError, error } = useSuspenseQuery({
        ...timelineQuery,
        initialData: timeline,
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
                The journey of a thousand kilometers starts with a step. The fact that you're using this means you took that first step.
            </div>
        )
    }

    return (
        <div>
            <Card>
                <Table>
                    <TableBody>
                        {
                            timeline.map((milestone) => (
                                <MilestoneRow key={`achieved:${milestone.timestamp}`} milestone={milestone} />
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

interface MilestoneRowProps {
    milestone: Milestone
}

function MilestoneRow({ milestone: { timestamp, achievements } }: MilestoneRowProps) {
    return (
        <>
            <TableRow>
                <TableHead colSpan={3}>
                    {moment(timestamp).toDate().toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </TableHead>
            </TableRow>
            {
                achievements.map((achievement) => {
                    switch (achievement.kind) {
                        case Kind.SavingsGoal:
                            return <SavingsGoalRow key={achievement.id} goal={achievement as SavingsGoal} />
                        default:
                            throw Error(`Unknown achievable kind ${achievement.kind}`)
                    }
                })
            }
        </>
    )
}

interface SavingsGoalRowProps {
    goal: SavingsGoal
}

function SavingsGoalRow({ goal }: SavingsGoalRowProps) {
    return (
        <TableRow>
            <TableCell className="w-[30%]">
                {goal.name}
            </TableCell>
            <TableCell className="w-[40%]">
                {goal.description}
            </TableCell>
            <TableCell className="text-right">
                <span>
                    Saved
                </span> <span>
                    {currencyAmountToHuman(goal.settings.saved, goal.settings.currency)}
                </span>
            </TableCell>
        </TableRow>
    )
}