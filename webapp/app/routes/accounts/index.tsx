import { useLoaderData } from "react-router";
import { createAccount } from "~/modules/accounts/api/queries/create-account";
import { getAccountsPreviews } from "~/modules/accounts/api/queries/get-accounts-previews";
import { Screen } from "~/modules/accounts/screens";
import { Create } from "~/modules/accounts/types/create";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Accounts" },
    { name: "description", content: "Manage your Accounts" }
  ]
}

interface ActionRequestBody extends Create {
  intent: "create"
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const values: ActionRequestBody = await request.json()

  if (values.intent !== "create") throw new Error("invalid action")

  const response = await createAccount({ ...values })

  return response
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const accounts = await getAccountsPreviews()

  return {
    breadcrumb: "Accounts",
    accounts,
  }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof clientLoader>()

  return <Screen accounts={accounts} />
}