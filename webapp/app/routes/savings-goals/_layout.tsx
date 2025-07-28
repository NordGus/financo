import { Outlet } from "react-router";
import { CurrenciesFilters } from "~/modules/achievements/savings-goals/components/filters/currencies";
import ClearFiltersButton from "~/modules/achievements/trophies/components/filters/clear-button";
import { FiltersContextProvider } from "~/modules/achievements/trophies/contexts/filters-context";
import { getFilters } from "~/modules/achievements/trophies/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Savings Goals" },
    { name: "description", content: "Manage your savings objectives" }
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getFilters(request)
  const currencies = await listCurrenciesQuery()

  return {
    currencies,
    filters
  }
}

export default function SavingsGoals({ loaderData }: Route.ComponentProps) {
  const { currencies, filters } = loaderData

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <FiltersContextProvider filters={filters}>
        <div className="flex grow h-dvh overflow-hidden">
          <ToolSidebar title="Savings Goals" className="min-w-[250px] max-w-[250px]">
            <ClearFiltersButton />
            <CurrenciesFilters />
          </ToolSidebar>
          <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
            <Outlet />
          </div>
        </div>
      </FiltersContextProvider>
    </CurrenciesContextProvider>
  )
}