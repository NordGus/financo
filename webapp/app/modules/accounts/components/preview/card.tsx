import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useFetcher, useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { Throbber } from "~/shared/components/throbber";
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
import { MainAccount } from "../badges/main-account";
import { ActionablesMenu } from "./actionables-menu";
import { AvailableCredit } from "./available-credit";
import { PaymentProgress } from "./payment-progress";

interface Props {
  account: Account
}

export function Preview({ account: loaderAccount }: Props) {
  const navigate = useNavigate()
  const fetcher = useFetcher<Account>()
  const {
    id,
    kind,
    currency,
    name,
    description,
    color,
    capital,
    additionalData: {
      main,
      balance,
      transactions
    },
    archivedAt,
    deletedAt
  } = fetcher.data || loaderAccount

  if (deletedAt) return null

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
        <div className="flex flex-row justify-end gap-2 pt-4">
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
      {
        fetcher.state === "idle" && (
          <CardFooter className="flex flex-row justify-end items-center gap-2">
            {
              isDebt(kind) && (
                <div className="flex-grow-[3]">
                  <PaymentProgress capital={capital} balance={balance} currency={currency} />
                </div>
              )
            }
            {
              isCredit(kind) && (
                <div className="flex-grow-[3]">
                  <AvailableCredit capital={capital} balance={balance} currency={currency} />
                </div>
              )
            }
            {
              isCapital(kind) && main && (
                <div className="flex justify-start grow">
                  <MainAccount />
                </div>
              )
            }
            <div className="flex-grow flex flex-row justify-end gap-2">
              <ActionablesMenu
                account={{ id, name, transactions }}
                isArchived={isArchived}
                fetcher={fetcher}
              />
            </div>
          </CardFooter>
        )
      }
      {
        fetcher.state !== "idle" && (
          <CardFooter className="flex flex-row justify-end items-center gap-2">
            <Throbber size="sm" />
          </CardFooter>
        )
      }
    </Card>
  )
}