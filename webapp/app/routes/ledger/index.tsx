import { Plus } from "lucide-react";
import { use, useState } from "react";
import {
  Link,
  useLocation,
  useResolvedPath
} from "react-router";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { TransactionsByCategory } from "~/modules/ledger/components/graphs/transactions-by-category";
import { AccountsContext } from "~/modules/ledger/contexts/accounts-context";
import { ExecutedTransaction } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { list as listCurrenciesQuery } from "~/modules/shared/api/queries/list-currencies";
import { Button } from "~/modules/shared/components/ui/button";
import { Label } from "~/modules/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/modules/shared/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/modules/shared/components/ui/tooltip";
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
  loaderData: { currencies, incomeCurrencies, expenseCurrencies, incomeTransactions, expenseTransactions }
}: Route.ComponentProps) {
  const { search, hash } = useLocation() // current location
  const { pathname: newPathname } = useResolvedPath("new", { relative: "route" })

  const { accountsMap } = use(AccountsContext)

  const [currency, setCurrency] = useState<Currency>(currencies.length > 0 ? currencies[0].code : "EUR")

  return (
    <section className="flex flex-col justify-center gap-2 overflow-y-hidden no-scrollbar my-2">
      <div className="grid grid-cols-2 gap-2 justify-stretch items-stretch">
        <span className="flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label>
                Currency
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              {"Which currency you want to summarize you transactions by"}
            </TooltipContent>
          </Tooltip>
        </span>
        <Select
          value={currency}
          onValueChange={(value) => setCurrency(value as Currency)}
          disabled={currencies.length <= 0}
        >
          <SelectTrigger className="w-full cursor-pointer" disabled={currencies.length <= 0}>
            <SelectValue placeholder="No Currencies Available" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(entry => (
              <SelectItem key={`currency-select-${entry.code}`} value={entry.code}>
                {entry.name}
              </SelectItem>
            ))}
            {
              currencies.length === 0 && (
                <SelectItem value={currency}>
                  {"No Currencies Available"}
                </SelectItem>
              )
            }
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-rows-2 gap-2">
        <div className="flex-1">
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
                <div className="h-[250px] w-full flex flex-col justify-center items-center gap-6">
                  <p className="text-center">
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
        </div>
        <div className="flex-1">
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
                <div className="h-[250px] w-full flex flex-col justify-center items-center gap-6">
                  <p className="text-center">
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
        </div>
      </div>
    </section>
  )
}
