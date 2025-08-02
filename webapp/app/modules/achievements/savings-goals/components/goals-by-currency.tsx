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
import { Plus } from "lucide-react";
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
import { Button } from "~/modules/shared/components/ui/button";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { useCurrencies } from "~/modules/shared/hooks/use-currencies";
import { Currency } from "~/modules/shared/types/currency";
import type { clientLoader } from "~/routes/savings-goals/savings-goals";
import { SavingsGoal } from "../types/savings-goal";

type Props = {
  currency: Currency
  goals: SavingsGoal[]
}

export function GoalsByCurrency({ currency, goals: goalsData }: Props) {
  const { currenciesMap } = useCurrencies()

  const name = useMemo(() => currenciesMap.get(currency)!.name, [currency, currenciesMap])

  const { search, hash } = useLocation()
  const { submit: reorder, state: status } = useFetcher<typeof clientLoader>({ key: `${currency}.reordered` })

  const [goals, setGoals] = useState(goalsData.sort((a, b) => a.position - b.position))

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setGoals(goalsData)
  }, [goalsData.sort((a, b) => a.position - b.position).map(goal => goal.id).join(",")])

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    const oldIndex = goals.findIndex(goal => goal.id === active.id)
    const newIndex = goals.findIndex(goal => goal.id === over!.id)

    if (oldIndex < 0 || newIndex < 0) return

    const goal = goals.at(oldIndex)

    if (!goal) return

    toast.promise(
      reorder(
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

    setGoals(arrayMove(goals, oldIndex, newIndex))
  }, [reorder, setGoals])

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading3>{name}</Heading3>
        <Button variant={"ghost"} asChild>
          <Link to={{ pathname: "new", search, hash }}>
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
          disabled={status === "submitting"}
          strategy={verticalListSortingStrategy}
        >
          {
            goals.map((goal) => (
              <DraggableGoalLink
                key={goal.id}
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
  search: string,
  hash: string
}

function DraggableGoalLink({ goal, search, hash }: DraggableGoalLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: goal.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition])


  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2.5">
      <Link to={{ pathname: goal.id.toString(), search, hash }}>
        <span key={goal.id}>{goal.name}</span>
      </Link>
    </div>
  )
}