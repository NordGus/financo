import { useMemo } from "react";
import { Progress } from "~/shared/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";
import { currencyAmountToHuman } from "~/shared/helpers/currency-amount-to-human";
import { Currency } from "~/shared/types/currency";

interface PaymentProgressProps {
  capital: number
  balance: number
  currency: Currency
}

export function PaymentProgress({ balance, capital, currency }: PaymentProgressProps) {
  const progress = useMemo(() => (Math.abs(balance) / Math.abs(capital)) * 100, [balance, capital])
  const balanceAmount = useMemo(() => currencyAmountToHuman(balance, currency), [balance])
  const capitalAmount = useMemo(() => currencyAmountToHuman(capital, currency), [capital])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row gap-2 items-center cursor-default">
          <Progress value={progress} /> <span>{progress}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {balanceAmount} paid out of {capitalAmount}
      </TooltipContent>
    </Tooltip>
  )
}