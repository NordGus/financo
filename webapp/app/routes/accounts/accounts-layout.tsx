import { Outlet } from "react-router";
import { CurrenciesFilters } from "~/modules/accounts/components/filters/currencies";
import { KindsFilters } from "~/modules/accounts/components/filters/kinds";
import { StatusFilters } from "~/modules/accounts/components/filters/status";
import { AccountsSidebar } from "~/modules/accounts/components/side-bar";
import { ListFiltersContextProvider } from "~/modules/accounts/contexts/list-filters-context";
import { getListFilters } from "~/modules/accounts/utils/router-requests";
import { Route } from "./+types/accounts-layout";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getListFilters(request)

  return {
    filters
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { filters } = loaderData

  return (
    <ListFiltersContextProvider filters={filters}>
      <AccountsSidebar>
        <StatusFilters />
        <KindsFilters />
        <CurrenciesFilters />
      </AccountsSidebar>
      <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
        <Outlet />
      </div>
    </ListFiltersContextProvider>
  )
}