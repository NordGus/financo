import { Tooltip } from "@radix-ui/react-tooltip";
import { isNil } from "lodash-es";
import {
  Package2Icon,
  StarIcon,
  StarOffIcon,
  TrashIcon
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import { Progress } from "~/shared/components/ui/progress";
import {
  TooltipContent,
  TooltipTrigger
} from "~/shared/components/ui/tooltip";
import { colorContrast } from "~/shared/helpers/color-contrast";
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color";
import {
  currencyAmountToHuman
} from "~/shared/helpers/currency-amount-to-human";
import { Account, isCapital, isCredit, isDebt } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";

interface MarkAsFavoriteProps {
  favorite: boolean
}

function MarkAsFavorite({ favorite }: MarkAsFavoriteProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="link" className="text-yellow-500">
          {
            favorite
              ? <StarOffIcon />
              : <StarIcon />
          }
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        favorite
      </TooltipContent>
    </Tooltip>
  )
}

interface PaymentProgressProps {
  capital: number
  balance: number
  currency: Currency
}

function PaymentProgress({ balance, capital, currency }: PaymentProgressProps) {
  const progress = useMemo(() => (Math.abs(balance) / Math.abs(capital)) * 100, [balance, capital])
  const balanceAmount = useMemo(() => currencyAmountToHuman(balance, currency), [balance])
  const capitalAmount = useMemo(() => currencyAmountToHuman(capital, currency), [capital])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row gap-2 items-center">
          <Progress value={progress} /> <span>{progress}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {balanceAmount} paid out of {capitalAmount}
      </TooltipContent>
    </Tooltip>
  )
}

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
      balance
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
        className="min-h-28"
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
              <MarkAsFavorite favorite={favorite} />
            </div>
          )
        }
        <div className="flex-grow flex flex-row justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary">
                <Package2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              archive
            </TooltipContent>
          </Tooltip>
          {
            !isArchived && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="destructive">
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  delete
                </TooltipContent>
              </Tooltip>
            )
          }
        </div>
      </CardFooter>
    </Card>
  )
}