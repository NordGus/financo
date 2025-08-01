import { Outlet } from "react-router";
import z from "zod";
import { list as listSavingsGoalsQuery } from "~/modules/achievements/savings-goals/api/queries/list";
import { GoalsByCurrency } from "~/modules/achievements/savings-goals/components/goals-by-currency";
import { isDefaultFilters } from "~/modules/achievements/savings-goals/types/filters";
import { getFilters } from "~/modules/achievements/savings-goals/utils/router-requests";
import { Card, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/savings-goals";

const savingsGoalsSchema = z.object({
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  goals: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullish(),
    position: z.number(),
    target: z.number(),
    saved: z.number(),
    currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
    updatedAt: z.iso.datetime(),
    createdAt: z.iso.datetime()
  }).array()
}).array()

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const goals = savingsGoalsSchema.safeParse(await listSavingsGoalsQuery(filters))

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