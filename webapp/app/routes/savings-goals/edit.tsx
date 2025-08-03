import { get as getSavingsGoalQuery } from "~/modules/achievements/savings-goals/api/queries/get";
import { FormTemplate } from "~/modules/achievements/savings-goals/components/form-template";
import { savingsGoalSchema } from "~/modules/achievements/savings-goals/schemas/queries";
import { Route } from "./+types/edit";

export async function clientAction({ }: Route.ClientActionArgs) {
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