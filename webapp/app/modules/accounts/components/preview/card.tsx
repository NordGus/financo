import { isNil } from "lodash-es";
import { useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import { icons } from "~/shared/components/ui/icon";
import { colorContrast } from "~/shared/helpers/color-contrast";
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color";
import {
  currencyAmountToHuman
} from "~/shared/helpers/currency-amount-to-human";
import { isDebt } from "~/shared/types/account";
import { Account } from "../../types/preview";
import { ArchivedAccount } from "../badges/archived-account";
import { MainAccount } from "../badges/main-account";
import { ActionablesMenu } from "./actionables-menu";
import { PaymentProgress } from "./payment-progress";

interface Props {
  account: Account
}

export function Preview({ account }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
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
    archivedAt,
    deletedAt
  } = account

  if (deletedAt) return null

  const isArchived = useMemo(() => !isNil(archivedAt), [archivedAt])
  const balanceAmount = useMemo(() => {
    if (isDebt(kind)) return currencyAmountToHuman(balance + capital, currency)

    return currencyAmountToHuman(balance, currency)
  }, [balance, capital])
  const balanceColorClass = useMemo(() => {
    if (isDebt(kind)) return currencyAmountColor(balance + capital)

    return currencyAmountColor(balance)
  }, [balance, capital])

  return (
    <>
      <Card>
        <CardHeader
          className="min-h-28 cursor-pointer"
          style={{
            backgroundColor: color,
            color: colorContrast(color)
          }}
          onClick={() => setOpenEdit(true)}
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
        <CardFooter className="flex flex-row justify-end items-center gap-2">
          {main && <MainAccount />}
          {isArchived && <ArchivedAccount />}
          <div className="flex-grow-[3]">
            <PaymentProgress capital={capital} balance={balance} currency={currency} color={color} kind={kind} />
          </div>
          <div className="flex-grow flex flex-row justify-end gap-2">
            <ActionablesMenu
              account={account}
            />
          </div>
        </CardFooter>
      </Card>
      <Dialog modal open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Edit your account</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}