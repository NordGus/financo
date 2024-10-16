import { cn } from "@/lib/utils";
import { Active, SavingsGoal } from "@/types/savings-goal";
import { getActiveSavingsGoals } from "@api/savings-goals";
import { Progress } from "@components/Progress";
import { Throbber } from "@components/Throbber";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    SensorDescriptor,
    SensorOptions,
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
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { staleTimeDefault } from "@queries/client";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, isNil } from "lodash";
import { GripVerticalIcon, InfoIcon, TrophyIcon } from "lucide-react";
import { useMemo, useState } from "react";

function keyFor({ id }: SavingsGoal) {
    return `savings-goal:${id}`
}

interface Props {
    onSetSavingsGoal: (goal: SavingsGoal) => void
    onCreateSavingsGoal: () => void
}

// TODO: save after sorting
function List({ onCreateSavingsGoal, onSetSavingsGoal }: Props) {
    const { data, isFetching, isError, error } = useQuery({
        queryKey: ["achievements", "savings-goals", "active"],
        queryFn: getActiveSavingsGoals,
        staleTime: staleTimeDefault
    })
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    if (isError) throw error

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
            {
                isNil(data) && isFetching
                    ? <div className="pb-6">
                        <Throbber />
                    </div>
                    : isNil(data) || isEmpty(data)
                        ? <NoResults onCreateSavingsGoal={onCreateSavingsGoal} />
                        : <div className="flex flex-col pb-6 gap-4">
                            {data.map((data) => (
                                <CurrencySection
                                    key={data.currency}
                                    data={data}
                                    sensors={sensors}
                                    onSetSavingsGoal={onSetSavingsGoal}
                                />
                            ))}
                        </div>
            }
        </Card>
    )
}

interface CurrencySectionProps {
    data: Active
    sensors: SensorDescriptor<SensorOptions>[]
    onSetSavingsGoal: (goal: SavingsGoal) => void
}

function CurrencySection({ data: { currency, goals }, onSetSavingsGoal, sensors }: CurrencySectionProps) {
    const [items, setItems] = useState(goals)

    return (
        <div className="flex flex-col">
            <div className="px-6 pb-2">
                <CardTitle>{currency}</CardTitle>
            </div>
            <div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={({ active, over }) => {
                        if (!over) return
                        if (active.id === over.id) return

                        setItems((items) => {
                            const prevIdx = items.findIndex(({ id }) => id === active.id)
                            const nextIdx = items.findIndex(({ id }) => id === over.id)

                            return arrayMove(items, prevIdx, nextIdx)
                        })
                    }}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((goal) => (
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
        </div>
    )
}

interface EntryProps {
    id: number
    goal: SavingsGoal
    onSetGoal: (goal: SavingsGoal) => void
}

function Entry({ goal, onSetGoal, id }: EntryProps) {
    const { name, description, settings: { saved, target, currency }, updatedAt } = goal
    const progress = useMemo(() => saved / target, [updatedAt])
    const color = useMemo(() => "#22c55e", [])

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

    return (
        <div
            className={
                cn(
                    "flex flex-row items-stretch py-2 px-6 gap-4 dark:hover:bg-zinc-900 hover:bg-zinc-100",
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
                    "flex items-center justify-center",
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
                <p className="grow">{name}</p>
                {
                    !isNil(description) && (
                        <Tooltip delayDuration={250}>
                            <TooltipTrigger className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">
                                <InfoIcon className="w-5 h-5" />
                            </TooltipTrigger>
                            <TooltipContent side="left">{description}</TooltipContent>
                        </Tooltip>
                    )
                }
                <Tooltip delayDuration={250}>
                    <TooltipTrigger>
                        <Progress progress={progress} icon={<TrophyIcon className="w-5 h-5" />} color={color} />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <span>
                            {currencyAmountToHuman(saved, currency)}
                        </span> / <span>
                            {currencyAmountToHuman(target, currency)}
                        </span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}

export { List };

interface NoResultsProps {
    onCreateSavingsGoal: () => void
}

function NoResults({ onCreateSavingsGoal }: NoResultsProps) {
    return (
        <CardContent className="space-y-2">
            <p>Looks like you don't have any active Savings Goals</p>
            <Button onClick={() => onCreateSavingsGoal}>
                Create a New Savings Goal
            </Button>
        </CardContent>
    )
}