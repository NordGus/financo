import { Fragment, use, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/modules/shared/components/ui/table";
import { CurrenciesContext } from "~/modules/shared/contexts/currencies-context";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { useAccountsStore } from "../../stores/accounts";

interface Summary {
  capital: number
  debt: number
}

type Finances = Record<string, Summary>

export function Screen() {
  const accounts = useAccountsStore((state => state.accounts))
  const { currencies } = use(CurrenciesContext)

  const summaries = useMemo<Finances>(() => {
    return accounts.filter(({ deletedAt }) => !deletedAt).reduce<Finances>((finances, account) => {
      if (!finances[account.currency]) finances[account.currency] = { capital: 0, debt: 0 }

      if (account.kind === "capital" || account.kind === "savings")
        finances[account.currency].capital += account.additionalData.balance

      if (account.kind === "debt" || account.kind === "credit")
        finances[account.currency].debt += account.additionalData.balance + account.capital

      return finances
    }, {})
  }, [accounts])

  const sections = useMemo(() => {
    return Object.fromEntries(currencies.map((currency) => ([currency.code, currency.name])))
  }, [currencies])

  return (
    <div className="flex flex-col gap-2">
      {
        Object.entries(summaries).map(([currency, summary]) => {
          const total = summary.capital + summary.debt

          return (
            <Fragment key={`summary.${currency}`}>
              <div className="flex gap-2 items-center mt-4">
                <p className="text-2xl">{sections[currency]}</p>
              </div>

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
                    <TableHead>Debts</TableHead>
                    <TableCell className={currencyAmountColor(summary.debt)}>
                      {currencyAmountToHuman(summary.debt, currency as Currency)}
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
            </Fragment>
          )
        })
      }
    </div>
  )
}