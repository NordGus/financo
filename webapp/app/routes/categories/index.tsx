import { URLSearchParamsInit, useFetcher, useLoaderData, useSearchParams } from "react-router";
import { toast } from "sonner";
import { createCategory } from "~/modules/categories/api/commands/create-category";
import { getCategoriesPreviews } from "~/modules/categories/api/queries/get-categories-previews";
import { Screen } from "~/modules/categories/screens";
import { Intents } from "~/modules/categories/types/actions";
import { Archived } from "~/modules/categories/types/archived";
import { Create, Created } from "~/modules/categories/types/create";
import { Deleted } from "~/modules/categories/types/delete";
import { Unarchived } from "~/modules/categories/types/unarchived";
import { Updated } from "~/modules/categories/types/update";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Ledger Categories" }
  ]
}

type ActionRequestBody = {
  payload: Create
  intent: Intents["create"]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const { payload }: ActionRequestBody = await request.json()

  try {
    const response = createCategory({ ...payload })

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
  const [searchParams, setSearchParams] = useSearchParams()
  const __fetcher = useFetcher<Created | Updated | Deleted | Archived | Unarchived | null>()

  const onSearchParamsChange = (params: URLSearchParamsInit) => setSearchParams(params)

  return <Screen
    accounts={accounts}
    searchParams={searchParams}
    onSearchParamsChange={onSearchParamsChange}
  />
}