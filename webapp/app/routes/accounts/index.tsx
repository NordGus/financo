import { useLoaderData } from "react-router";
import { toast } from "sonner";
import { createAccount } from "~/modules/accounts/api/commands/create-account";
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

  try {
    const response = createAccount({ ...values })

    toast.promise(response, {
      loading: "Creating...",
      success: (data) => {
        return `${data.name} created`
      },
      error: "Oops!. Something went wrong"
    })

    const created = await response

    return created
  } catch (error) {
    if (error instanceof Response && error.status === 401) throw error

    console.error(error)

    return null
  }
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