import { Outlet } from "react-router";
import z from "zod";
import { reorder as reorderSavingsGoalsCommand } from "~/modules/achievements/savings-goals/api/commands/reorder";
import { list as listSavingsGoalsQuery } from "~/modules/achievements/savings-goals/api/queries/list";
import { GoalsByCurrency } from "~/modules/achievements/savings-goals/components/goals-by-currency";
import { reorderActionSchema } from "~/modules/achievements/savings-goals/schemas/actions";
import { savingsGoalsGroupSchema } from "~/modules/achievements/savings-goals/schemas/queries";
import { Reorder } from "~/modules/achievements/savings-goals/types/commands";
import { isDefaultFilters } from "~/modules/achievements/savings-goals/types/filters";
import { getFilters } from "~/modules/achievements/savings-goals/utils/router-requests";
import { Card, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { Route } from "./+types/savings-goals";

async function reorderSavingsGoal(params: Reorder): Promise<z.infer<typeof savingsGoalsGroupSchema>> {
  const res = await reorderSavingsGoalsCommand(params)
  const { data, error, success } = savingsGoalsGroupSchema.safeParse(res)

  if (!success) throw error

  return data
}

const actionSchema = z.discriminatedUnion("intent", [reorderActionSchema])

export async function clientAction({ request }: Route.ClientActionArgs) {
  const action = actionSchema.safeParse(await request.json())

  if (!action.success) throw action.error

  switch (action.data.intent) {
    case "reorder":
      return reorderSavingsGoal({
        id: action.data.id,
        from: action.data.from,
        to: action.data.to,
      })
  }
}

const loaderSchema = savingsGoalsGroupSchema.array()

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const goals = loaderSchema.safeParse(await listSavingsGoalsQuery(filters))

  if (!goals.success) throw goals.error

  return {
    goals: goals.data.sort(
      (a, b) => (a.currency.localeCompare(b.currency, undefined, { sensitivity: "base" }))
    ),
    filters
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { goals, filters } = loaderData

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
        <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
          <span
            className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
          />
          <div className="flex flex-col flex-1 gap-2 py-2 overflow-y-scroll no-scrollbar">
            {
              goals.map(({ currency, goals }) => (
                <GoalsByCurrency key={currency} currency={currency} goals={goals} />
              ))
            }
            {
              isDefaultFilters(filters) && goals.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{"Your journey is just starting!"}</CardTitle>
                    <CardDescription>
                      {"You haven't unlock any Achievements, yet. Keep going!"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            }
            {
              !isDefaultFilters(filters) && goals.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{"It seems you haven't unlock any Achievements matching the filters!"}</CardTitle>
                    <CardDescription>
                      {"Please adjust the filters"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            }
          </div>
          <span
            className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
          />
        </div>
      </section>
      <Outlet />
    </>
  )
}