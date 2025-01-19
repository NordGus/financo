import { useMemo } from "react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import { icons } from "~/shared/components/ui/icon";
import { colorContrast } from "~/shared/helpers/color-contrast";
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color";
import {
  currencyAmountToHuman
} from "~/shared/helpers/currency-amount-to-human";
import { isDebt } from "~/shared/types/account";
import { Account } from "../types/preview";
import { MainAccount } from "./badges/main-account";
import { PaymentProgress } from "./payment-progress";

interface Props {
  account: Account
  onSelectAccount: (account: Account) => void
}

export function PreviewCard({ account, onSelectAccount }: Props) {
  const {
    kind,
    currency,
    name,
    description,
    color,
    capital,
    icon,
    additionalData: {
      main,
      balance,
    },
    deletedAt
  } = account

  if (deletedAt) return null

  const balanceAmount = useMemo(
    () => currencyAmountToHuman(isDebt(kind) ? balance + capital : balance, currency),
    [balance, capital, currency]
  )
  const balanceColorClass = useMemo(
    () => currencyAmountColor(isDebt(kind) ? balance + capital : balance),
    [balance, capital]
  )

  return (
    <Card>
      <CardHeader
        className="min-h-20 cursor-pointer p-4"
        style={{
          backgroundColor: color,
          color: colorContrast(color)
        }}
        onClick={() => onSelectAccount(account)}
      >
        <CardTitle className="flex flex-row gap-1 items-center [&_svg]:size-5">
          {icons[icon]} {name}
        </CardTitle>
        <CardDescription
          style={{
            color: colorContrast(color),
            opacity: "70%",
          }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 p-4">
        <div>
          {main && <MainAccount />}
          <PaymentProgress capital={capital} balance={balance} currency={currency} color={color} kind={kind} />
        </div>
        <div className="flex flex-row gap-2 justify-end col-span-2">
          {
            capital !== 0 && (
              <span>
                {
                  capital > 0
                    ? "I'm owed"
                    : "I owe"
                }
              </span>
            )
          }
          <span className={cn("font-semibold", balanceColorClass)}>
            {balanceAmount}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}