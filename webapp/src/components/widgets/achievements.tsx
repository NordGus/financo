import { useQuery } from "@tanstack/react-query";
import { isEmpty, isNil } from "lodash";
import { CircleHelpIcon, TrophyIcon } from "lucide-react";
import moment from "moment";

import Goal from "@/types/Goal";

import { staleTimeDefault } from "@queries/Client";
import { getGoals } from "@api/goals";

import { Progress } from "@components/Progress";
import { Throbber } from "@components/Throbber";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";

export function AchievementsTracker({ className }: { className?: string }) {
    // [ ] TODO: Implement goals/achievements endpoints

    // const query = useQuery({
    //     queryKey: ['goals', 'tracker'],
    //     queryFn: getGoals,
    //     staleTime: staleTimeDefault
    // })

    const isFetching = false
    const goals: Goal[] = [
        {
            id: 1,
            name: "My first emergency fund",
            description: "A journey of a thousand kilometers start with a single step",
            goal: 100000,
            currency: "EUR",
            balance: 100000,
            position: 1,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 2,
            name: "This is not even my final form",
            description: "Take the emergency fund to 3 month's income",
            goal: 600000,
            currency: "EUR",
            balance: 600000,
            position: 2,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 3,
            name: "Inner Peace",
            description: "Your emergency fund gives you 3 month's runway",
            goal: 1200000,
            currency: "EUR",
            balance: 1200000,
            position: 3,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 4,
            name: "Harmony within, Hurricane without",
            description: "Now your emergency fund has 12 month's income",
            goal: 2400000,
            currency: "EUR",
            balance: 1200000,
            position: 4,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 5,
            name: "Upgrades for my Desktop",
            description: null,
            goal: 100000,
            currency: "EUR",
            balance: 0,
            position: 5,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 6,
            name: "Investment for the Studio",
            description: "Buying some hardware to create games better",
            goal: 600000,
            currency: "EUR",
            balance: 0,
            position: 6,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        },
        {
            id: 7,
            name: "Honeymoon",
            description: "A little treat for my spouse",
            goal: 2000000,
            currency: "EUR",
            balance: 0,
            position: 7,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        }
    ]

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                        Progression for your active savings goals
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent>
                {
                    isNil(goals) || isEmpty(goals)
                        ? <div className="mt-4 space-y-4">
                            <p>You have no active savings goals</p>
                            <Button variant="outline" className="">Create New Goal</Button>
                        </div>
                        : <Table>
                            <TableBody>
                                {
                                    goals.sort((a, b) => a.position - b.position).map((goal) => {
                                        const progress = goal.balance / goal.goal
                                        const color = "#22c55e"

                                        return <TableRow>
                                            <TableCell>{goal.name}</TableCell>
                                            <TableCell>
                                                {!isNil(goal.description) && (
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger
                                                            className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
                                                        >
                                                            <CircleHelpIcon size={18} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {goal.description}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Progress
                                                    progress={progress}
                                                    icon={<TrophyIcon size={20} />}
                                                    color={color}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                }
            </CardContent>
        </Card>
    )
}