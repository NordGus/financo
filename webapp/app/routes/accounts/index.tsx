import { URLSearchParamsInit, useFetcher, useLoaderData, useSearchParams } from "react-router";
import { toast } from "sonner";
import { createAccount } from "~/modules/accounts/api/commands/create-account";
import { getAccountsPreviews } from "~/modules/accounts/api/queries/get-accounts-previews";
import { Screen } from "~/modules/accounts/screens";
import { Archived } from "~/modules/accounts/types/archived";
import { Create, Created } from "~/modules/accounts/types/create";
import { Deleted } from "~/modules/accounts/types/delete";
import { Unarchived } from "~/modules/accounts/types/unarchived";
import { Update, Updated } from "~/modules/accounts/types/update";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Accounts" },
    { name: "description", content: "Manage your Accounts" }
  ]
}

type ActionRequestBody = {
  payload: Create
  intent: "create"
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const values: ActionRequestBody = await request.json()

  if (values.intent !== "create") throw new Error("invalid action")

  console.log(values)

  try {
    const response = createAccount({ ...values.payload })

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
    console.error(error)

    throw error
  }
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const accounts = await getAccountsPreviews()

  return {
    breadcrumb: "Accounts",
    accounts
  }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof clientLoader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const fetcher = useFetcher<Created | Updated | Deleted | Archived | Unarchived | null>()

  const onSearchParamsChange = (params: URLSearchParamsInit) => setSearchParams(params)

  const onCreateAccount = (values: Create, success: () => void, failure: () => void) => {
    return fetcher.submit(
      { payload: { ...values }, intent: "create" },
      { action: "/accounts", method: "post", encType: "application/json" }
    ).then((__res) => success()).catch((error) => {
      failure()

      throw error
    })
  }

  const onUpdateAccount = (values: Update, success: () => void, failure: () => void) => {
    return fetcher.submit(
      { payload: { ...values }, intent: "update" },
      { action: `/accounts/${values.id}`, method: "post", encType: "application/json" }
    ).then((__res) => success()).catch((error) => {
      failure()

      throw error
    })
  }

  const onArchiveAccount = (id: number, success: () => void, failure: () => void) => {
    return fetcher.submit(
      { payload: { id }, intent: "archive" },
      { action: `/accounts/${id}`, method: "post", encType: "application/json" }
    ).then((__res) => success()).catch((error) => {
      failure()

      throw error
    })
  }

  const onUnarchiveAccount = (id: number, success: () => void, failure: () => void) => {
    return fetcher.submit(
      { payload: { id }, intent: "unarchive" },
      { action: `/accounts/${id}`, method: "post", encType: "application/json" }
    ).then((__res) => success()).catch((error) => {
      failure()

      throw error
    })
  }

  const onDeleteAccount = (id: number, success: () => void, failure: () => void) => {
    return fetcher.submit(
      { payload: { id }, intent: "unarchive" },
      { action: `/accounts/${id}`, method: "post", encType: "application/json" }
    ).then((__res) => success()).catch((error) => {
      failure()

      throw error
    })
  }

  return <Screen
    accounts={accounts}
    onSearchParamsChange={onSearchParamsChange}
    searchParams={searchParams}
    onCreateAccountAction={onCreateAccount}
    onUpdateAccountAction={onUpdateAccount}
    onArchiveAccountAction={onArchiveAccount}
    onUnarchiveAccountAction={onUnarchiveAccount}
    onDeleteAccountAction={onDeleteAccount}
  />
}