import { useLoaderData } from "react-router";
import { getCategoriesPreviews } from "~/modules/categories/api/queries/get-categories-previews";
import { Screen } from "~/modules/categories/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Ledger Categories" }
  ]
}

export async function clientAction({ }: Route.ClientActionArgs) {
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