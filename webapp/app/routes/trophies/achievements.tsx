import { format } from "date-fns";
import { Fragment } from "react";
import { Outlet } from "react-router";
import z from "zod";
import { list as listMilestonesQuery } from "~/modules/achievements/trophies/api/queries/list";
import { SavingsGoal } from "~/modules/achievements/trophies/components/achivements/saving-goal";
import { getFilters } from "~/modules/achievements/trophies/utils/router-requests";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/achievements";

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
  const milestones = milestoneSchema.safeParse(await listMilestonesQuery(getFilters(request)))

  if (!milestones.success) throw milestones.error

  return {
    milestones: milestones.data
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { milestones } = loaderData

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
        <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
          <span
            className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
          />
          <div className="flex flex-col flex-1 gap-2 py-2 overflow-y-scroll no-scrollbar">
            {
              milestones.map(({ timestamp, achievements }) => (
                <Fragment key={timestamp}>
                  <Heading3>{format(new Date(timestamp), "PPP")}</Heading3>
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
                              {"Sorry, this kind of achievement is not supported"}
                            </span>
                          )
                      }
                    })
                  }
                </Fragment>
              ))
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