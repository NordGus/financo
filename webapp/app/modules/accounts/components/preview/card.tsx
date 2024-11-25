import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import { colorContrast } from "~/shared/helpers/color-contrast";
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color";
import {
  currencyAmountToHuman
} from "~/shared/helpers/currency-amount-to-human";
import { isCapital, isCredit, isDebt } from "~/shared/types/account";
import { Account } from "../../types/preview";
import { ActionablesMenu } from "./actionables-menu";
import { MarkAsFavorite } from "./actionables/mark-as-favorite";
import { PaymentProgress } from "./payment-progress";

interface Props {
  account: Account
}

export function Preview({
  account: {
    id,
    kind,
    currency,
    name,
    description,
    color,
    capital,
    settings: {
      favorite,
      balance,
      transactionCount
    },
    archivedAt
  }
}: Props) {
  const navigate = useNavigate()

  const isArchived = useMemo(() => !isNil(archivedAt), [archivedAt])
  const balanceAmount = useMemo(() => {
    if (isDebt(kind)) return currencyAmountToHuman(balance + capital, currency)
    if (isCredit(kind)) return currencyAmountToHuman(balance + capital, currency)

    return currencyAmountToHuman(balance, currency)
  }, [balance, capital])
  const balanceColorClass = useMemo(() => {
    if (isDebt(kind)) return currencyAmountColor(balance + capital)
    if (isCredit(kind)) return currencyAmountColor(balance + capital)

    return currencyAmountColor(balance)
  }, [balance, capital])

  return (
    <Card className={cn(isArchived && "opacity-50")}>
      <CardHeader
        className="min-h-28 cursor-pointer"
        style={{
          backgroundColor: color,
          color: colorContrast(color)
        }}
        onClick={() => navigate(`/accounts/${id}`)}
      >
        <CardTitle>{name}</CardTitle>
        <CardDescription
          style={{
            color: colorContrast(color),
            opacity: "70%",
          }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-end gap-1 pt-4">
          <span className={cn("font-semibold", balanceColorClass)}>
            {balanceAmount}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end items-center gap-2">
        {
          isDebt(kind) && (
            <div className="flex-grow-[3]">
              <PaymentProgress capital={capital} balance={balance} currency={currency} />
            </div>
          )}
        {
          isCapital(kind) && (
            <div className="flex justify-start grow">
              <MarkAsFavorite favorite={favorite} id={id} />
            </div>
          )
        }
        <div className="flex-grow flex flex-row justify-end gap-2">
          <ActionablesMenu
            account={{ id, name, transactionCount }}
            isArchived={isArchived}
          />
        </div>
      </CardFooter>
    </Card>
  )
}