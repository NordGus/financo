import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsByCategory } from "~/modules/ledger/components/graphs/transactions-by-category";
import { ExecutedTransaction } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/modules/shared/components/ui/card";
import { Currency } from "~/modules/shared/types/currency";
import { Route } from "./+types/index";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [transactions, currencies] = await Promise.allSettled([
    listTransactionsQuery(getFilters(request)),
    listCurrenciesQuery()
  ])

  if (transactions.status === "rejected") throw transactions.reason
  if (currencies.status === "rejected") throw currencies.reason

  const executed = transactions.value.filter(({ executedAt }) => executedAt !== null) as ExecutedTransaction[]

  const incomeTransactions = executed.filter(({ metadata: { kind } }) => kind === "income")
  const expenseTransactions = executed.filter(({ metadata: { kind } }) => kind === "expense")

  const incomeCurrencies = incomeTransactions.reduce(
    (accumulator, transaction) => accumulator.add(transaction.currency),
    new Set<Currency>
  )

  const expenseCurrencies = expenseTransactions.reduce(
    (accumulator, transaction) => accumulator.add(transaction.currency),
    new Set<Currency>
  )

  return {
    incomeCurrencies: currencies.value.filter(entry => incomeCurrencies.has(entry.code)),
    expenseCurrencies: currencies.value.filter(entry => expenseCurrencies.has(entry.code)),
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
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accountsMap } } = matches[2]

  const { search } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative my-2">
      <FullScreenThrobber
        className={cn(
          "absolute inset-0 z-50",
          (navigationState === "idle" || location?.search === search) && "hidden"
        )}
      />
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses Summary</CardTitle>
            <CardDescription>
              {"Expense Transactions by category for the period"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsByCategory
              transactions={expenseTransactions}
              accounts={accountsMap}
              title={"Expenses"}
              currency="EUR"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
            <CardDescription>
              {"Income Transactions by category for the period"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsByCategory
              transactions={incomeTransactions}
              accounts={accountsMap}
              title={"Income"}
              currency="EUR"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
