import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigation, useResolvedPath } from "react-router";
import { cn } from "~/lib/utils";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsByCategory } from "~/modules/ledger/components/graphs/transactions-by-category";
import { ExecutedTransaction } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { FullScreenThrobber } from "~/modules/shared/components/throbber";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/modules/shared/components/ui/card";
import { Label } from "~/modules/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/modules/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/modules/shared/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
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
    currencies: currencies.value.filter(entry => incomeCurrencies.has(entry.code) || expenseCurrencies.has(entry.code)),
    incomeCurrencies,
    expenseCurrencies,
    incomeTransactions,
    expenseTransactions
  }
}

export default function Index({
  loaderData: {
    currencies,
    incomeCurrencies,
    expenseCurrencies,
    incomeTransactions,
    expenseTransactions
  },
  matches
}: Route.ComponentProps) {
  // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.
  const { data: { accountsMap } } = matches[2]

  const { search, hash } = useLocation() // current location
  const { state: navigationState, location } = useNavigation() // navigation location

  const { pathname: newPathname } = useResolvedPath("new", { relative: "route" })

  const [currency, setCurrency] = useState<Currency>(currencies.length > 0 ? currencies[0].code : "EUR")

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative my-2">
      <FullScreenThrobber
        className={cn(
          "absolute inset-0 z-50",
          (navigationState === "idle" || location?.search === search) && "hidden"
        )}
      />
      <div className="flex gap-2">
        <span className="flex-1 contents-[' ']" />
        <Tooltip>
          <TooltipTrigger>
            <Label>
              Currency
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            {"Which currency you want to summarize you transactions by"}
          </TooltipContent>
        </Tooltip>
        <Select
          value={currency}
          onValueChange={(value) => setCurrency(value as Currency)}
          disabled={currencies.length <= 0}
        >
          <SelectTrigger className="flex-1 cursor-pointer" disabled={currencies.length <= 0}>
            <SelectValue placeholder="No Currencies Available" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(entry => (
              <SelectItem key={`currency-select-${entry.code}`} value={entry.code}>
                {entry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {
        currencies.length > 1 && (
          <div className="flex gap-2">
            <Label>
              Currency
            </Label>
            <Tabs
              className="grow"
              value={currency}
              onValueChange={(value) => setCurrency(value as Currency)}
            >
              <TabsList className="w-full">
                {currencies.map(currency => (
                  <TabsTrigger key={currency.code} value={currency.code}>
                    {currency.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )
      }
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Expenses Summary</CardTitle>
          <CardDescription>
            {"Expense Transactions by category for the period"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            expenseCurrencies.has(currency)
              ? (
                <TransactionsByCategory
                  transactions={expenseTransactions}
                  accounts={accountsMap}
                  title={"Expenses"}
                  currency={currency}
                />
              ) : (
                <div className="h-[300px] w-full flex flex-col justify-center items-center gap-4">
                  <p className="text-lg">
                    {"Sorry there are no Expense Transactions for the given currency and filters"}
                  </p>
                  <Button asChild>
                    <Link to={{ pathname: newPathname, search, hash }}>
                      <Plus /> You can create a new Transaction
                    </Link>
                  </Button>
                </div>
              )
          }
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Income Summary</CardTitle>
          <CardDescription>
            {"Income Transactions by category for the period"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            incomeCurrencies.has(currency)
              ? (
                <TransactionsByCategory
                  transactions={incomeTransactions}
                  accounts={accountsMap}
                  title={"Income"}
                  currency={currency}
                />
              ) : (
                <div className="h-[300px] w-full flex flex-col justify-center items-center gap-4">
                  <p className="text-lg">
                    {"Sorry there are no Income Transactions for the given currency and filters"}
                  </p>
                  <Button asChild>
                    <Link to={{ pathname: newPathname, search, hash }}>
                      <Plus /> You can create a new Transaction
                    </Link>
                  </Button>
                </div>
              )
          }
        </CardContent>
      </Card>
    </section>
  )
}
