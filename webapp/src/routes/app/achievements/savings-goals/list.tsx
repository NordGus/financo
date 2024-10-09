import { cn } from "@/lib/utils";
import { placeholder, SavingsGoal } from "@/types/SavingsGoal";
import { Progress } from "@components/Progress";
import { Button } from "@components/ui/button";
import { Card, CardHeader, CardTitle } from "@components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { isNil } from "lodash";
import { GripVerticalIcon, InfoIcon, TrophyIcon } from "lucide-react";
import { useState } from "react";

function keyFor({ id }: SavingsGoal) {
    return `savings-goal:${id}`
}

interface Props {
    onSetSavingsGoal: (goal: SavingsGoal) => void
    onCreateSavingsGoal: () => void
}

// TODO: save after sorting
function List({ onCreateSavingsGoal, onSetSavingsGoal }: Props) {
    const [goals, setGoals] = useState(placeholder)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

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
            <div className="flex flex-col pb-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={({ active, over }) => {
                        if (!over) return
                        if (active.id === over.id) return

                        setGoals((items) => {
                            const prevIdx = items.findIndex(({ id }) => id === active.id)
                            const nextIdx = items.findIndex(({ id }) => id === over.id)

                            return arrayMove(items, prevIdx, nextIdx)
                        })
                    }}
                >
                    <SortableContext
                        items={goals}
                        strategy={verticalListSortingStrategy}
                    >
                        {goals.map((goal) => (
                            <Entry
                                key={keyFor(goal)}
                                id={goal.id}
                                goal={goal}
                                onSetGoal={onSetSavingsGoal}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </Card>
    )
}

interface EntryProps {
    id: number
    goal: SavingsGoal
    onSetGoal: (goal: SavingsGoal) => void
}

function Entry({ goal, onSetGoal, id }: EntryProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
        isOver
    } = useSortable({ id })
    const style = { transform: CSS.Transform.toString(transform), transition }
    const progress = goal.settings.saved / goal.settings.target
    const color = "#22c55e"

    return (
        <div
            className={
                cn(
                    "flex flex-row items-center py-2 px-6 gap-4 dark:hover:bg-zinc-900 hover:bg-zinc-100",
                    ((isDragging || isSorting || isOver) && "cursor-grabbing")
                )
            }
            style={style}
            ref={setNodeRef}
            {...attributes}
        >
            <div
                className={cn(
                    "p-1.5 border rounded-lg border-zinc-200 dark:border-zinc-800",
                    (isDragging || isSorting || isOver ? "cursor-grabbing" : "cursor-grab")
                )}
                ref={setActivatorNodeRef}
                {...listeners}
            >
                <GripVerticalIcon className="w-5 h-5" />
            </div>
            <div
                className={cn(
                    "flex flex-row items-center gap-4 grow",
                    (!(isDragging || isSorting || isOver) && "cursor-pointer")
                )}
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
        </div>
    )
}

export { List };
