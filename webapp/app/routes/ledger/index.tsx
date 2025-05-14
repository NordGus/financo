import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsByCategory } from "~/modules/ledger/components/graphs/transactions-by-category";
import { ExecutedTransaction } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Heading2 } from "~/modules/shared/components/ui/headings";
import { CurrenciesContextProvider } from "~/modules/shared/contexts/currencies-context";
import { Route } from "./+types/index";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const transactions = await listTransactionsQuery(getFilters(request))

  const executed = transactions.filter(({ executedAt }) => executedAt !== null) as ExecutedTransaction[]

  const incomeTransactions = executed.filter(({ metadata: { kind } }) => kind === "income")
  const expenseTransactions = executed.filter(({ metadata: { kind } }) => kind === "expense")

  return {
    incomeTransactions,
    expenseTransactions
  }
}

export default function Index({
  loaderData: {
    incomeTransactions,
    expenseTransactions
  },
  matches
}: Route.ComponentProps) {
  // extracting data from webapp/app/modules/shared/layout.tsx's loader.
  const { data: { currencies } } = matches[1]
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accountsMap } } = matches[2]

  const { search } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative my-2">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.search === search) && "hidden"
          )}
        />
        <Heading2>Expenses</Heading2>
        <div className="flex-1">
          <TransactionsByCategory
            transactions={expenseTransactions}
            accounts={accountsMap}
            title="Expenses"
          />
        </div>
        <Heading2>Income</Heading2>
        <div className="flex-1">
          <TransactionsByCategory
            transactions={incomeTransactions}
            accounts={accountsMap}
            title="Income"
          />
        </div>
      </section>
    </CurrenciesContextProvider>
  )
}
