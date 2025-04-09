import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { AccountsContextProvider } from "~/modules/ledger/contexts/accounts-context";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/new";

export function clientLoader({ }: Route.ClientLoaderArgs) {
  return { breadcrumb: "New Transaction" }
}

export default function New({ matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accounts, accountsMap } } = matches[2]

  const { pathname } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location


  return (
    <CurrenciesContextProvider currencies={currencies}>
      <AccountsContextProvider accounts={accounts} accountsMap={accountsMap}>
        <section className="flex flex-col h-full max-h-full overflow-y-auto no-scrollbar relative items-center justify-center">
          <FullScreenThrobber
            className={cn(
              "absolute inset-0 z-50",
              (navigationState === "idle" || location.pathname === pathname) && "hidden"
            )}
          />
          Create Transaction
        </section>
      </AccountsContextProvider>
    </CurrenciesContextProvider>
  )
}
