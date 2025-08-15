import { createPath, redirect } from "react-router";
import z from "zod";
import { update as updateSavingsGoalCommand } from "~/modules/achievements/savings-goals/api/commands/update";
import { get as getSavingsGoalQuery } from "~/modules/achievements/savings-goals/api/queries/get";
import { FormTemplate } from "~/modules/achievements/savings-goals/components/form-template";
import { updateSchema } from "~/modules/achievements/savings-goals/schemas/create-or-update";
import { destroySchema } from "~/modules/achievements/savings-goals/schemas/destroy";
import { markAsAchievedSchema } from "~/modules/achievements/savings-goals/schemas/mark-as-achieved";
import { savingsGoalSchema } from "~/modules/achievements/savings-goals/schemas/queries";
import { Route } from "./+types/edit";

const actionsSchema = z.discriminatedUnion(
  "intent",
  [
    updateSchema,
    destroySchema,
    markAsAchievedSchema
  ]
)

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)

  const { search, hash } = new URL(request.url)
  const actions = actionsSchema.safeParse(await request.json())

  if (!actions.success) throw actions.error

  switch (actions.data.intent) {
    case "update":
      await updateSavingsGoalCommand({
        id,
        name: actions.data.name,
        description: actions.data.description,
        currency: actions.data.currency,
        target: actions.data.target
      })

      return redirect(createPath({ pathname: `/savings-goals/${id}`, search, hash }))
    case "destroy":
      return { action: "destroy", status: "ok", id }
    case "mark-as-achieved":
      return { action: "mark-as-achieved", status: "ok", id }
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)

  const goal = savingsGoalSchema.safeParse(await getSavingsGoalQuery(id))

  if (!goal.success) throw goal.error

  return { goal: goal.data }
}

export default function New({ loaderData }: Route.ComponentProps) {
  const { goal } = loaderData

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <FormTemplate
          goalId={goal.id}
          name={goal.name}
          description={goal.description}
          targetAmount={goal.target}
          currency={goal.currency}
          role="update"
        />
      </div>
    </section>
  )
}