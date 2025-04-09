import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/index";

export default function Index({ matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/ledger.tsx's loader.
  const { data: { executedTransactions } } = matches[3]

  const { search } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location


  return (
    <CurrenciesContextProvider currencies={currencies}>
      <section className="flex flex-col h-full max-h-full overflow-y-auto no-scrollbar relative items-center justify-center">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.search === search) && "hidden"
          )}
        />
        Transactions filtered {executedTransactions.length}
      </section>
    </CurrenciesContextProvider>
  )
}
