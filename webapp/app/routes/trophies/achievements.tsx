import { format } from "date-fns";
import { Fragment } from "react";
import { Outlet } from "react-router";
import z from "zod";
import { list as listMilestonesQuery } from "~/modules/achievements/trophies/api/queries/list";
import { SavingsGoal } from "~/modules/achievements/trophies/components/achievements/saving-goal";
import { MoveDateRangeLink } from "~/modules/achievements/trophies/components/buttons/move-date-rage-link";
import { isDefaultFilters } from "~/modules/achievements/trophies/types/filters";
import { getFilters } from "~/modules/achievements/trophies/utils/router-requests";
import { Card, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { Heading5 } from "~/modules/shared/components/ui/headings";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/achievements";

const DATE_FORMAT_STRING = "PPP"

const milestoneSchema = z.object({
  timestamp: z.iso.datetime(),
  achievements: z.discriminatedUnion(
    "kind",
    [
      // Savings Goals
      z.object({
        id: z.number(),
        kind: z.literal("savings_goal"),
        name: z.string(),
        description: z.string().nullish(),
        settings: z.object({
          position: z.number(),
          target: z.number(),
          saved: z.number(),
          currency: z.enum(CurrenciesForZodEnum)
        }),
        achievedAt: z.iso.datetime().nullish(),
        deletedAt: z.iso.datetime().nullish(),
        updatedAt: z.iso.datetime(),
        createdAt: z.iso.datetime()
      }),
    ]
  ).array()
}).array()

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const milestones = milestoneSchema.safeParse(await listMilestonesQuery(filters))

  if (!milestones.success) throw milestones.error

  return {
    milestones: milestones.data,
    filters
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { milestones, filters } = loaderData

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
        <div className="flex justify-between">
          <MoveDateRangeLink direction="backwards" variant={"outline"} />
          <span className="h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium flex-1 inline-flex justify-center items-center">
            {
              filters.period === "unlimited"
                ? (<>{"Entire Achievement History"}</>)
                : filters.period === "daily"
                  ? (
                    <span className="font-bold">
                      {format(filters.from!, DATE_FORMAT_STRING)}
                    </span>
                  )
                  : (
                    <span>
                      {"From "}
                      <span className="font-bold">
                        {format(filters.from!, DATE_FORMAT_STRING)}
                      </span>
                      {" to "}
                      <span className="font-bold">
                        {format(filters.to!, DATE_FORMAT_STRING)}
                      </span>
                    </span>
                  )
            }
          </span>
          <MoveDateRangeLink direction="forwards" variant={"outline"} />
        </div>
        <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
          <span
            className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
          />
          <div className="flex flex-col flex-1 gap-2 py-2 overflow-y-scroll no-scrollbar">
            {
              milestones.map(({ timestamp, achievements }) => (
                <Fragment key={timestamp}>
                  <Heading5 className="text-muted-foreground">{format(new Date(timestamp), "PPP")}</Heading5>
                  {
                    achievements.map((achievement) => {
                      switch (achievement.kind) {
                        case "savings_goal":
                          return (
                            <SavingsGoal
                              key={achievement.id}
                              id={achievement.id}
                              name={achievement.name}
                              description={achievement.description}
                              saved={achievement.settings.saved}
                              currency={achievement.settings.currency}
                            />
                          )
                        default:
                          console.error({
                            message: `kind: ${achievement.kind}, not implemented`,
                            achievement
                          })

                          return (
                            <span
                              key={achievement.id}
                              className="bg-destructive rounded-xl p-6 text-destructive-foreground"
                            >
                              {"If you are seeing this, financo has a bug please fix it"}
                            </span>
                          )
                      }
                    })
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