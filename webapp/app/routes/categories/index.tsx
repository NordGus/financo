import { useLoaderData } from "react-router";
import { toast } from "sonner";
import { createCategory } from "~/modules/categories/api/commands/create-category";
import { getCategoriesPreviews } from "~/modules/categories/api/queries/get-categories-previews";
import { Screen } from "~/modules/categories/screens";
import { Intent } from "~/modules/categories/types/actions";
import { Create } from "~/modules/categories/types/create";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Ledger Categories" }
  ]
}

interface ActionRequestBody extends Create {
  intent: Intent
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const values: ActionRequestBody = await request.json()

  if (values.intent !== "create") throw new Error("invalid action")

  try {
    const response = createCategory({ ...values })

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

    return null
  }
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const accounts = await getCategoriesPreviews()

  return {
    breadcrumb: "Categories",
    accounts
  }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof clientLoader>()

  return <Screen accounts={accounts} />
}