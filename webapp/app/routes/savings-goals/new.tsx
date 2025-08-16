import { createPath, redirect } from "react-router";
import { create as createSavingsGoalCommand } from "~/modules/achievements/savings-goals/api/commands/create";
import { FormTemplate } from "~/modules/achievements/savings-goals/components/form-template";
import { createSchema } from "~/modules/achievements/savings-goals/schemas/create-or-update";
import { savingsGoalSchema } from "~/modules/achievements/savings-goals/schemas/queries";
import { Route } from "./+types/new";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const { search, hash } = new URL(request.url)
  const actions = createSchema.safeParse(await request.json())

  if (!actions.success) throw actions.error

  const response = savingsGoalSchema.safeParse(
    await createSavingsGoalCommand({
      name: actions.data.name,
      description: actions.data.description,
      target: actions.data.target,
      currency: actions.data.currency
    })
  )

  if (!response.success) throw response.error

  return redirect(createPath({ pathname: `/savings-goals/${response.data.id}`, search, hash }))
}

export default function New({ }: Route.ComponentProps) {
  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <FormTemplate
        goalId={undefined}
        name={undefined}
        description={undefined}
        targetAmount={undefined}
        savedAmount={undefined}
        currency={undefined}
        role="create"
      />
    </section>
  )
}