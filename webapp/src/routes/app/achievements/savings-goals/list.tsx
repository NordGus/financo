import { SavingsGoal, placeholder } from "@/types/SavingsGoal";
import { Progress } from "@components/Progress";
import { Button } from "@components/ui/button";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { isNil } from "lodash";
import { InfoIcon, TrophyIcon } from "lucide-react";

interface Props {
    onSetSavingsGoal: (goal: SavingsGoal) => void
    onCreateSavingsGoal: () => void
}

function List({ onCreateSavingsGoal, onSetSavingsGoal }: Props) {
    return (
        <Card className="overflow-clip">
            <CardHeader
                className="flex flex-row justify-between items-start space-x-0 space-y-0"
            >
                <CardTitle>Savings Goals</CardTitle>
                <Button onClick={() => onCreateSavingsGoal()}>
                    New
                </Button>
            </CardHeader>
            <div className="flex flex-col gap-4 pb-6">
                {placeholder.map((goal) => <Entry goal={goal} onSetGoal={onSetSavingsGoal} />)}
            </div>
        </Card>
    )
}

interface EntryProps {
    goal: SavingsGoal,
    onSetGoal: (goal: SavingsGoal) => void
}

function Entry({ goal, onSetGoal }: EntryProps) {
    const progress = goal.settings.saved / goal.settings.target
    const color = "#22c55e"

    return (
        <div
            className="cursor-pointer flex flex-row py-1 px-4 items-center gap-4 dark:hover:bg-zinc-800 hover:bg-zinc-200"
            onClick={() => onSetGoal(goal)}
        >
            <p className="grow">{goal.name}</p>
            {
                !isNil(goal.description) && (
                    <Tooltip delayDuration={250}>
                        <TooltipTrigger className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">
                            <InfoIcon className="w-5 h-5" />
                        </TooltipTrigger>
                        <TooltipContent>{goal.description}</TooltipContent>
                    </Tooltip>
                )
            }
            <Progress progress={progress} icon={<TrophyIcon className="w-5 h-5" />} color={color} />
        </div>
    )
}

export { List };
