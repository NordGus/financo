import { redirect } from "react-router";
import { z } from "zod";
import { archive as archiveAccountCommand } from "~/modules/accounts/api/commands/archive";
import { destroy as destroyAccountCommand } from "~/modules/accounts/api/commands/destroy";
import { unarchive as unarchiveAccountCommand } from "~/modules/accounts/api/commands/unarchive";
import { update as updateAccountCommand } from "~/modules/accounts/api/commands/update";
import { get as getAccountQuery } from "~/modules/accounts/api/queries/get";
import { FormTemplate } from "~/modules/accounts/components/forms/form-template";
import { schema as archiveActionSchema } from "~/modules/accounts/schemas/archive";
import { schema as destroyActionSchema } from "~/modules/accounts/schemas/destroy";
import { schema as unarchiveActionSchema } from "~/modules/accounts/schemas/unarchive";
import { schema as updateActionSchema } from "~/modules/accounts/schemas/update";
import { Route } from "./+types/edit";

const actionsSchema = z.discriminatedUnion(
  "intent",
  [
    updateActionSchema,
    destroyActionSchema,
    archiveActionSchema,
    unarchiveActionSchema
  ]
)

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const action = actionsSchema.safeParse(await request.json())

  if (!action.success) throw action.error

  switch (action.data.intent) {
    case "destroy":
      await destroyAccountCommand(id)

      return redirect("/accounts")
    case "archive":
      await archiveAccountCommand(id)

      return redirect(`/accounts/${id}`)
    case "unarchive":
      await unarchiveAccountCommand(id)

      return redirect(`/accounts/${id}`)
    case "update":
      await updateAccountCommand({
        id,
        currency: action.data.currency,
        color: action.data.color,
        icon: action.data.icon,
        name: action.data.name,
        description: action.data.description,
        capital: action.data.capital,
        main: action.data.main,
        history: {
          at: action.data.historyAt,
          balance: action.data.historyBalance
        }
      })

      return redirect(`/accounts/${id}`)
  }
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)

  const account = await getAccountQuery(id)

  return { account }
}

export default function New({ loaderData }: Route.ComponentProps) {
  const { account } = loaderData

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <FormTemplate
          kind={account.kind}
          currency={account.currency}
          color={account.color}
          icon={account.icon}
          name={account.name}
          description={account.description}
          capital={account.capital}
          main={account.additionalData.main}
          hasHistory={!!account.additionalData.history.at}
          historyAt={!account.additionalData.history.at ? null : new Date(account.additionalData.history.at)}
          historyBalance={account.additionalData.history.balance}
          archivedAt={!account.archivedAt ? null : new Date(account.archivedAt)}
          transactions={account.additionalData.transactions}
          role={"update"}
        />
      </div>
    </section>
  )
}