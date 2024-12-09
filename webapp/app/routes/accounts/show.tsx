import { useLoaderData } from "react-router";
import { toast } from "sonner";
import { createAccount } from "~/modules/accounts/api/commands/create-account";
import { getAccount } from "~/modules/accounts/api/queries/get-account";
import { Screen } from "~/modules/accounts/screens/show";
import { Create } from "~/modules/accounts/types/create";
import { Route } from "./+types/show";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `financo - Account - ${data.account.name}` },
    { name: "description", content: "Manage your Account" }
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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)
  const account = await getAccount(id)

  return {
    breadcrumb: account.name,
    account,
  }
}

export default function Show() {
  const { account } = useLoaderData<typeof clientLoader>()

  return <Screen account={account} />
}