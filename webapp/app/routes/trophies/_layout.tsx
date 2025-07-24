import { Outlet } from "react-router";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { ToolSidebar } from "~/modules/shared/components/tool-sidebar";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/_layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Trophies" },
    { name: "description", content: "Remember how far you've come" }
  ]
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  const currencies = await listCurrenciesQuery()

  return {
    currencies
  }
}

export default function Trophies({ loaderData }: Route.ComponentProps) {
  const { currencies } = loaderData

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <div className="flex grow h-dvh overflow-hidden">
        <ToolSidebar title="Trophy Room" className="min-w-[250px] max-w-[250px]">

        </ToolSidebar>
        <div className="grow overflow-hidden no-scrollbar grid grid-cols-2 justify-stretch items-stretch gap-4 px-4">
          <Outlet />
        </div>
      </div>
    </CurrenciesContextProvider>
  )
}