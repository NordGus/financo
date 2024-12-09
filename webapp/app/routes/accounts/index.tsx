import { useLoaderData } from "react-router";
import { getAccountsPreviews } from "~/modules/accounts/api/queries/get-accounts-previews";
import { Screen } from "~/modules/accounts/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Accounts" },
    { name: "description", content: "Manage your Accounts" }
  ]
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const accounts = await getAccountsPreviews()

  return { accounts }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof clientLoader>()

  return <Screen accounts={accounts} />
}