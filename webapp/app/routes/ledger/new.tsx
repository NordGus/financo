import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Route } from "./+types/new";

export function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "New Transaction" }
}

export default function New({ matches }: Route.ComponentProps) {
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts: __accounts, accountsMap: __accountsMap } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location


  return (
    <section className="flex flex-col h-full max-h-full overflow-y-auto no-scrollbar relative items-center justify-center">
      <FullScreenThrobber
        className={cn(
          "absolute inset-0 z-50",
          (navigationState === "idle" || location.pathname === pathname) && "hidden"
        )}
      />
      Create Transaction
    </section>
  )
}
