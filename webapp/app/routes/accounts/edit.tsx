import { get as getAccountQuery } from "~/modules/accounts/api/queries/get";
import { FormTemplate } from "~/modules/accounts/components/forms/form-template";
import { Route } from "./+types/edit";

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