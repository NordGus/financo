import { useMemo } from "react";
import { CustomProgressProps, Progress } from "~/shared/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";
import { currencyAmountToHuman } from "~/shared/helpers/currency-amount-to-human";
import { isCredit, isDebt, Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";

interface PaymentProgressProps extends CustomProgressProps {
  kind: Kind
  capital: number
  balance: number
  currency: Currency
}

export function PaymentProgress({ kind, balance, capital, currency, color }: PaymentProgressProps) {
  const progress = useMemo(() => Math.round((Math.abs(balance) / Math.abs(capital)) * 100), [balance, capital])
  const balanceAmount = useMemo(() => currencyAmountToHuman(balance, currency), [balance])
  const capitalAmount = useMemo(() => currencyAmountToHuman(capital, currency), [capital])

  if (!(isCredit(kind) || isDebt(kind))) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row gap-2 items-center cursor-default">
          <Progress value={progress} color={color} /> <span>{progress}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {isDebt(kind) && (`${balanceAmount} paid out of ${capitalAmount}`)}
        {isCredit(kind) && (`${balanceAmount} available out of ${capitalAmount}`)}
      </TooltipContent>
    </Tooltip>
  )
}