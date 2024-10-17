import { Achievable, Kind, Settings } from "@/types/achievable"
import { SavingsGoal } from "@/types/savings-goal"
import { Throbber } from "@components/Throbber"
import { Card } from "@components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@components/ui/table"
import currencyAmountToHuman from "@helpers/currencyAmountToHuman"
import { achievedAchievements } from "@queries/my-journey"
import { useSuspenseQuery } from "@tanstack/react-query"
import { groupBy, isEmpty, isNil } from "lodash"
import moment from "moment"
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
            <Card>
                <Table>
                    <TableBody>
                        {
                            Object.entries(groupBy(
                                data,
                                (achievement) => achievement.achievedAt!
                            )).map(([date, achievables]) => {
                                const achievedAt = moment(date).toDate()

                                return <DateRow
                                    key={`achieved:${achievedAt.toISOString()}`}
                                    date={achievedAt}
                                    achievables={achievables}
                                    onSetSavingsGoal={onSetSavingsGoal}
                                />
                            })
                        }
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

interface DateRowProps {
    date: Date
    achievables: Achievable<Settings>[]
    onSetSavingsGoal: (goal: SavingsGoal) => void
}

function DateRow({ date, achievables, onSetSavingsGoal }: DateRowProps) {
    return (
        <>
            <TableRow>
                <TableHead colSpan={3}>
                    {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </TableHead>
            </TableRow>
            {
                achievables.map((achievable) => {
                    switch (achievable.kind) {
                        case Kind.SavingsGoal:
                            return <SavingsGoalRow
                                key={achievable.id}
                                goal={achievable as SavingsGoal}
                                onSetSavingsGoal={onSetSavingsGoal}
                            />
                        default:
                            throw Error(`Unknown achievable kind ${achievable.kind}`)
                    }
                })
            }
        </>
    )
}

interface SavingsGoalRowProps {
    goal: SavingsGoal,
    onSetSavingsGoal: (goal: SavingsGoal) => void
}

function SavingsGoalRow({ goal, onSetSavingsGoal }: SavingsGoalRowProps) {
    return (
        <TableRow
            className="cursor-pointer"
            onClick={() => onSetSavingsGoal(goal)}
        >
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