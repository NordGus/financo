import { Outlet } from "react-router";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { Route } from "./+types/ledger";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const transactions = await listTransactionsQuery(getFilters(request))

  return { transactions }
}

export default function Index({ }: Route.ComponentProps) {
  // const accounts = useAccountsMap()
  // const [, setSearchParams] = useSearchParams()

  return (
    <>
      <section className="h-full py-2 overflow-y-auto">
        <div className="h-full border rounded-lg">
          listado
        </div>
      </section>
      <Outlet />
    </>
  )
}
