import { Info } from "lucide-react";
import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list-pending";
import { TransactionsSearchResults } from "~/modules/ledger/components/transactions-search-results";
import { mapToPendingTransactions } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/index";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const transactions = await listTransactionsQuery(getFilters(request))

  const pendingTransactions = mapToPendingTransactions(transactions)

  return {
    pendingTransactions
  }
}

export default function Index({ loaderData: { pendingTransactions }, matches }: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/modules/shared/_layout.tsx's loader.
  const { data: { accountsMap: accounts } } = matches[2]
  // extracting data from webapp/app/routes/ledger/ledger.tsx's loader.
  const { data: { executedTransactions } } = matches[3]

  const { search } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <section className="flex flex-col gap-2 h-full max-h-full overflow-y-hidden no-scrollbar relative my-4">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.search === search) && "hidden"
          )}
        />
        {
          pendingTransactions.length > 0 && (
            <>
              <div className="flex gap-4 items-center">
                <Heading3>Pending Transactions</Heading3>
                <Tooltip>
                  <TooltipTrigger className="[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent>
                    {"Transactions which do not have execution date"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative rounded-lg overflow-clip border max-h-[45dvh]">
                <TransactionsSearchResults
                  transactions={pendingTransactions}
                  accounts={accounts}
                />
              </div>
            </>
          )
        }
        <div className="flex-2">
          <p>
            Transactions filtered {executedTransactions.length}
          </p>
        </div>
      </section>
    </CurrenciesContextProvider>
  )
}
