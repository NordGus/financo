import { Outlet } from "react-router";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Accounts" },
    { name: "description", content: "Manage your Accounts" }
  ]
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const currencies = await listCurrenciesQuery()

  return {
    currencies
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { currencies } = loaderData

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <div className="flex grow h-dvh overflow-hidden">
        <Outlet />
      </div>
    </CurrenciesContextProvider>
  )
}