import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  Link,
  useFetcher,
  useLocation
} from "react-router";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { currencyAmountToHuman as formatCurrency } from "~/modules/shared/helpers/currency-amount-to-human";
import { useCurrencies } from "~/modules/shared/hooks/use-currencies";
import { Currency } from "~/modules/shared/types/currency";
import type { clientAction } from "~/routes/savings-goals/savings-goals";
import { SavingsGoal } from "../types/savings-goal";

type Props = {
  currency: Currency
  goals: SavingsGoal[]
}

export function GoalsByCurrency({ currency, goals: goalsData }: Props) {
  const { currenciesMap } = useCurrencies()

  const name = useMemo(() => currenciesMap.get(currency)!.name, [currency, currenciesMap])

  const { pathname, search, hash } = useLocation()
  const fetcher = useFetcher<typeof clientAction>({ key: `${currency}.reordered` })

  const [goals, setGoals] = useState(goalsData)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setGoals(goalsData)
  }, [goalsData.map(goal => goal.id).join(",")])

  useEffect(() => {
    if (!fetcher.data) return

    setGoals(fetcher.data.goals)
  }, [fetcher.data?.goals.map(({ id }) => id).join(",")])

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    const oldIndex = goals.findIndex(goal => goal.id === active.id)
    const newIndex = goals.findIndex(goal => goal.id === over!.id)

    if (oldIndex < 0 || newIndex < 0) return

    const goal = goals.at(oldIndex)

    if (!goal) return

    setGoals(arrayMove([...goals], oldIndex, newIndex))

    toast.promise(
      fetcher.submit(
        {
          id: goal.id,
          from: oldIndex,
          to: newIndex,
          intent: "reorder"
        },
        {
          method: "post",
          encType: "application/json"
        }
      ),
      {
        loading: `Reordering Savings Goals in ${name}...`,
        success: `Savings Goals in ${name} reordered!`,
        error: `Oops, looks like something went wrong!`
      }
    )
  }, [fetcher.submit, setGoals, goals.map(goal => goal.id).join(",")])

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading3>{name}</Heading3>
        <Button variant={"outline"} asChild>
          <Link to={{ pathname: `new/${currency}`, search, hash }}>
            <Plus /> New Goal
          </Link>
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={goals}
          strategy={verticalListSortingStrategy}
        >
          {
            goals.map((goal) => (
              <DraggableGoalLink
                key={goal.id}
                pathname={pathname}
                goal={goal}
                search={search}
                hash={hash}
              />
            ))
          }
        </SortableContext>
      </DndContext>
    </>
  )
}

type DraggableGoalLinkProps = {
  goal: SavingsGoal,
  pathname: string
  search: string,
  hash: string
}

function DraggableGoalLink({ goal, pathname, search, hash }: DraggableGoalLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: goal.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition])


  return (
    <div ref={setNodeRef} style={style} className="flex gap-2">
      <Button asChild size={"icon"} variant={"ghost"} className="hover:cursor-grab focus:cursor-grabbing mt-3">
        <span {...attributes} {...listeners}>
          <GripVertical />
        </span>
      </Button>
      <Link
        to={{ pathname: goal.id.toString(), search, hash }}
        className={cn(
          "border p-2.5 w-full rounded-lg flex flex-col gap-1 justify-stretch",
          pathname.endsWith(goal.id.toString())
            ? "border-foreground"
            : "hover:border-foreground! border-transparent"
        )}
      >
        <span className="text-lg">{goal.name}</span>
        <span className="text-xs text-muted-foreground">
          {goal.description}
        </span>
        <span className="text-right">
          <span className="font-bold">{formatCurrency(goal.saved, goal.currency)}</span> saved out of <span className="font-bold">{formatCurrency(goal.target, goal.currency)}</span>
        </span>
      </Link>
    </div>
  )
}