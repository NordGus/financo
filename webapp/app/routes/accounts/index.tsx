import { Plus } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useResolvedPath } from "react-router";
import { list as listAccountsQuery } from "~/modules/accounts/api/queries/list";
import { getListFilters } from "~/modules/accounts/utils/router-requests";
import { InfoTooltipIcon } from "~/modules/shared/components/tooltips/info/icon";
import { Button } from "~/modules/shared/components/ui/button";
import { Heading3 } from "~/modules/shared/components/ui/headings";
import { Label } from "~/modules/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/modules/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/modules/shared/components/ui/table";
import { CurrenciesContext } from "~/modules/shared/contexts/currencies-context";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Route } from "./+types/index";

type Summary = {
  capital: number
  savings: number
  debt: number
  credit: number
}

type Summaries = Record<Currency, Summary>

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const accounts = await listAccountsQuery(getListFilters(request))

  const summaries = Object.fromEntries(accounts.filter(({ deletedAt }) => !deletedAt).reduce(
    (map, account) => {
      const summary = map.get(account.currency) ?? { capital: 0, savings: 0, debt: 0, credit: 0 }

      switch (account.kind) {
        case "capital":
          return map.set(
            account.currency,
            { ...summary, capital: summary.capital + account.additionalData.balance }
          )
        case "savings":
          return map.set(
            account.currency,
            { ...summary, savings: summary.savings + account.additionalData.balance }
          )
        case "debt":
          return map.set(
            account.currency,
            { ...summary, debt: summary.debt + account.additionalData.balance + account.capital }
          )
        case "credit":
          return map.set(
            account.currency,
            { ...summary, credit: summary.credit + account.additionalData.balance + account.capital }
          )
        default:
          return map
      }
    },
    new Map<Currency, Summary>
  ).entries()) as Summaries

  const currencies = Object.keys(summaries).sort() as Currency[]

  return {
    summaries,
    summaryCurrencies: currencies
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { summaries, summaryCurrencies } = loaderData

  const { currencies: systemCurrencies } = use(CurrenciesContext)

  const currencies = useMemo(
    () => systemCurrencies.filter(({ code }) => summaryCurrencies.includes(code)),
    [summaryCurrencies.join(".")]
  )

  const [currency, setCurrency] = useState<Currency | undefined>(currencies.at(0)?.code)

  useEffect(() => {
    setCurrency(currencies.at(0)?.code)
  }, [summaryCurrencies.join(".")])

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar my-2">
      <Heading3>Finances Summary</Heading3>
      <div className="space-y-2">
        <Label className="flex gap-2">
          Currency
          <InfoTooltipIcon>
            {"Which currency you want to check your balance"}
          </InfoTooltipIcon>
        </Label>
        <Select
          value={currency}
          onValueChange={(value) => setCurrency(value as Currency)}
          disabled={currencies.length <= 1}
        >
          <SelectTrigger className="w-full cursor-pointer" disabled={currencies.length <= 0}>
            <SelectValue placeholder="No Currency available" />
          </SelectTrigger>
          <SelectContent>
            {
              currencies.map(({ code, name }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <SummaryTable summaries={summaries} currency={currency} />
    </section>
  )
}

function SummaryTable({ summaries, currency }: { summaries: Summaries, currency?: Currency }) {
  const { search, hash } = useLocation() // current location
  const { pathname: newPathname } = useResolvedPath("new", { relative: "route" })

  if (!currency) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <span className="text-destructive-foreground">
          {"You don't have any Accounts registered yet!"}
        </span>
        <Button asChild>
          <Link to={{ pathname: newPathname, search, hash }}>
            <Plus /> Create a new Transaction
          </Link>
        </Button>
      </div>
    )
  }

  const summary = summaries[currency]

  const total = summary.capital + summary.savings + summary.debt + summary.credit

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead className="w-[30%]">Capital</TableHead>
          <TableCell className={currencyAmountColor(summary.capital)}>
            {currencyAmountToHuman(summary.capital, currency as Currency)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="w-[30%]">Savings</TableHead>
          <TableCell className={currencyAmountColor(summary.savings)}>
            {currencyAmountToHuman(summary.savings, currency as Currency)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Debts</TableHead>
          <TableCell className={currencyAmountColor(summary.debt)}>
            {currencyAmountToHuman(summary.debt, currency as Currency)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Credit</TableHead>
          <TableCell className={currencyAmountColor(summary.credit)}>
            {currencyAmountToHuman(summary.credit, currency as Currency)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Total</TableHead>
          <TableCell className={currencyAmountColor(total)}>
            {currencyAmountToHuman(total, currency as Currency)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}