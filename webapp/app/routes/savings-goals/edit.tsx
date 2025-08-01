import z from "zod";
import { get as getSavingsGoalQuery } from "~/modules/achievements/savings-goals/api/queries/get";
import { Heading1 } from "~/modules/shared/components/ui/headings";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/edit";

export async function clientAction({ }: Route.ClientActionArgs) {
}

const loaderSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  position: z.number(),
  target: z.number(),
  saved: z.number(),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime()
})

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)

  const goal = loaderSchema.safeParse(await getSavingsGoalQuery(id))

  if (!goal.success) throw goal.error

  return { goal: goal.data }
}

export default function New({ loaderData }: Route.ComponentProps) {
  const { goal } = loaderData

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <Heading1>Edit Placeholder for {goal.name}</Heading1>
        <p>{goal.description}</p>
      </div>
    </section>
  )
}