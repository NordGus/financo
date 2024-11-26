import { useState } from "react";
import { useLoaderData } from "react-router";
import { getAccountsPreviews } from "~/modules/accounts/api/queries/get-accounts-previews";
import { Screen } from "~/modules/accounts/screens";
import { Kind } from "~/shared/types/account";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - accounts" },
    { name: "description", content: "manage your accounts" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  const accounts = await getAccountsPreviews()

  return {
    breadcrumb: "accounts",
    accounts,
  }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof clientLoader>()
  // TODO implement useReducer
  const [__formFor, setFromFor] = useState<Kind | null>(null)

  const onNew = (kind: Kind) => setFromFor(kind)

  return <Screen accounts={accounts} onNew={onNew} />
}