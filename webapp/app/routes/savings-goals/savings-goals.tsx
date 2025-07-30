import { Fragment, use } from "react";
import { Outlet } from "react-router";
import z from "zod";
import { list as listSavingsGoalsQuery } from "~/modules/achievements/savings-goals/api/queries/list";
import { isDefaultFilters } from "~/modules/achievements/savings-goals/types/filters";
import { getFilters } from "~/modules/achievements/savings-goals/utils/router-requests";
import { Card, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { CurrenciesContext } from "~/modules/shared/contexts/currencies-context";
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
  const milestones = savingsGoalsSchema.safeParse(await listSavingsGoalsQuery(filters))

  if (!milestones.success) throw milestones.error

  return {
    milestones: milestones.data,
    filters
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { milestones, filters } = loaderData

  const { currenciesMap } = use(CurrenciesContext)

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
        <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
          <span
            className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
          />
          <div className="flex flex-col flex-1 gap-2 py-2 overflow-y-scroll no-scrollbar">
            {
              milestones.map(({ currency, goals }) => (
                <Fragment key={currency}>
                  <Heading3>{currenciesMap.get(currency)!.name}</Heading3>
                  {
                    goals.map((goal) => (<span key={goal.id}>{goal.name}</span>))
                  }
                </Fragment>
              ))
            }
            {
              isDefaultFilters(filters) && milestones.length === 0 && (
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
              !isDefaultFilters(filters) && milestones.length === 0 && (
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