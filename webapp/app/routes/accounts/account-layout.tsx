import { Outlet } from "react-router";
import { AccountsSidebar } from "~/modules/accounts/components/side-bar";
import { ListFiltersContextProvider } from "~/modules/accounts/contexts/list-filters-context";
import { getListFilters } from "~/modules/accounts/utils/router-requests";
import { Route } from "./+types/account-layout";

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
        {/* TODO: Implement filters for the account route */}
      </AccountsSidebar>
      <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
        <Outlet />
      </div>
    </ListFiltersContextProvider>
  )
}