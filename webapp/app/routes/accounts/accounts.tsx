import { Outlet } from "react-router";
import { list as listAccountsQuery } from "~/modules/accounts/api/queries/list";
import { Account, Kind } from "~/modules/accounts/types/accounts";
import { Route } from "./+types/accounts";

type AccountRecords = Record<Kind, Account[]>

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const accounts = await listAccountsQuery()

  const records = Object.fromEntries(accounts.reduce(
    (map, account) => {
      const accounts = map.get(account.kind) ?? []

      return map.set(account.kind, [...accounts, account])
    },
    new Map<Kind, Account[]>
  ).entries()) as AccountRecords

  return {
    accounts: records
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { accounts } = loaderData

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar my-2">
        {Object.keys(accounts).join(", ")}
      </section>
      <Outlet />
    </>
  )
}