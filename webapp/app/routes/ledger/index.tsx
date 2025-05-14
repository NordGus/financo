import { useState } from "react";
import { useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsByCategory } from "~/modules/ledger/components/graphs/transactions-by-category";
import { ExecutedTransaction } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/modules/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs";
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

  const [summaryFor, setSummaryFor] = useState<"expense" | "income">("expense")

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative my-2">
        <FullScreenThrobber
          className={cn(
            "absolute inset-0 z-50",
            (navigationState === "idle" || location?.search === search) && "hidden"
          )}
        />
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              {"Executed Transactions by parent category for the period"}
            </CardDescription>
            <div className="flex justify-between items-center mt-4">
              <Tabs value={summaryFor} onValueChange={(value) => setSummaryFor(value === "expense" ? value : "income")}>
                <TabsList>
                  <TabsTrigger value="expense">
                    Expenses
                  </TabsTrigger>
                  <TabsTrigger value="income">
                    Income
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionsByCategory
              transactions={summaryFor === "expense" ? expenseTransactions : incomeTransactions}
              accounts={accountsMap}
              title={summaryFor === "expense" ? "Expenses" : "Income"}
            />
          </CardContent>
        </Card>
      </section>
    </CurrenciesContextProvider>
  )
}
