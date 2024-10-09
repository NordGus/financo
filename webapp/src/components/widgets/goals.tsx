import { cn } from "@/lib/utils";
import { placeholder } from "@/types/SavingsGoal";
import { Progress } from "@components/Progress";
import { Throbber } from "@components/Throbber";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { isEmpty, isNil } from "lodash";
import { InfoIcon, TrophyIcon } from "lucide-react";

export function GoalsTracker({ className }: { className?: string }) {
    // [ ] Implement goals/achievements endpoints

    // const query = useQuery({
    //     queryKey: ['goals', 'tracker'],
    //     queryFn: getGoals,
    //     staleTime: staleTimeDefault
    // })

    const isFetching = false

    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Goals Tracker</CardTitle>
                    <CardDescription>
                        Progression for your active savings goals
                    </CardDescription>
                </div>
                {isFetching && <Throbber variant="small" />}
            </CardHeader>
            <CardContent className="grow overflow-y-auto">
                {
                    isNil(placeholder) || isEmpty(placeholder)
                        ? <div className="mt-4 space-y-4">
                            <p>You have no active savings goals</p>
                            <Button variant="outline" className="">Create New Goal</Button>
                        </div>
                        : <Table>
                            <TableBody>
                                {
                                    placeholder.sort((a, b) => a.settings.position - b.settings.position).map((goal) => {
                                        const { target, saved } = goal.settings
                                        const progress = saved / target
                                        const color = "#22c55e"

                                        return <TableRow key={`goal:${goal.id}`}>
                                            <TableCell>{goal.name}</TableCell>
                                            <TableCell>
                                                {!isNil(goal.description) && (
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger
                                                            className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
                                                        >
                                                            <InfoIcon className="w-5 h-5" />
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
                                                    icon={<TrophyIcon className="w-5 h-5" />}
                                                    color={color}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                }
                {
                    isNil(placeholder) || isEmpty(placeholder)
                        ? <div className="mt-4 space-y-4">
                            <p>You have no active savings goals</p>
                            <Button variant="outline" className="">Create New Goal</Button>
                        </div>
                        : <Table>
                            <TableBody>
                                {
                                    placeholder.sort((a, b) => a.settings.position - b.settings.position).map((goal) => {
                                        const progress = goal.settings.saved / goal.settings.target
                                        const color = "#22c55e"

                                        return <TableRow key={`goal:${goal.id}`}>
                                            <TableCell>{goal.name}</TableCell>
                                            <TableCell>
                                                {!isNil(goal.description) && (
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger
                                                            className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
                                                        >
                                                            <InfoIcon className="w-5 h-5" />
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
                                                    icon={<TrophyIcon className="w-5 h-5" />}
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