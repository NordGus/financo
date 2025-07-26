import z from "zod";
import { get as getMilestonesQuery } from "~/modules/achievements/trophies/api/queries/get";
import { SavingsGoal as Preview } from "~/modules/achievements/trophies/components/achievements/saving-goal";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/savings-goal";

const milestoneSchema = z.object({
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
})

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)
  const milestone = milestoneSchema.safeParse(await getMilestonesQuery(id))

  if (!milestone.success) throw milestone.error

  return {
    milestone: milestone.data
  }
}

export default function SavingsGoal({ loaderData }: Route.ComponentProps) {
  const { milestone } = loaderData

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
        <span
          className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
        />
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          <Preview
            key={milestone.id}
            id={milestone.id}
            name={milestone.name}
            description={milestone.description}
            saved={milestone.settings.saved}
            currency={milestone.settings.currency}
          />
        </div>
        <span
          className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
        />
      </div>
    </section>
  )
}