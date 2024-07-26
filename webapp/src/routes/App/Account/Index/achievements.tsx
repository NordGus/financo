import { useQuery } from "@tanstack/react-query";
import { isEmpty, isNil } from "lodash";
import moment from "moment";

import Goal from "@/types/Goal";

import { staleTimeDefault } from "@queries/Client";
import { getGoals } from "@api/goals";

import { Progress } from "@components/Progress";
import { Throbber } from "@components/Throbber";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { TrophyIcon } from "lucide-react";

export function AchievementsTracker() {
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
            name: "The emergency fund is getting serious",
            description: "Leveling the emergency fund to 3 months payment",
            goal: 600000,
            currency: "EUR",
            balance: 133700,
            position: 2,
            achievedAt: null,
            archivedAt: null,
            createdAt: moment().add({ month: -3 }).toDate().toISOString(),
            updatedAt: moment().add({ month: -3 }).toDate().toISOString()
        }
    ]

    return (
        <Card>
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
                        ? <div className="mt-4 space-y-2">
                            <p>You have no active savings goals</p>
                            <Button variant="outline" className="">Create New Goal</Button>
                        </div>
                        : <Table>
                            <TableBody>
                                {
                                    isNil(goals) || isEmpty(goals)
                                        ? <TableRow>
                                            <TableCell className="text-center">
                                                You have no active savings goals
                                            </TableCell>
                                        </TableRow>
                                        : goals.map((goal) => {
                                            const progress = goal.balance / goal.goal
                                            const color = "#22c55e"

                                            return <TableRow>
                                                <TableCell>{goal.name}</TableCell>
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