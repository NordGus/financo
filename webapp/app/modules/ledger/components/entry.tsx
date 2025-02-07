import { isFuture } from "date-fns";
import { memo } from "react";
import { cn } from "~/lib/utils";
import { icons } from "~/modules/shared/components/ui/icon";
import { colorContrast } from "~/modules/shared/helpers/color-contrast";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Account } from "../types/accounts";
import { Transaction } from "../types/transactions";

interface Props {
  transaction: Transaction
  source: Account
  sourceParent?: Account | null
  target: Account
  targetParent?: Account | null
}

function accountName(account: Account, parent: Account | null): string {
  if (!parent) return account.name

  return `${parent.name} (${account.name})`
}

function account(source: Account, target: Account): Account {
  switch (true) {
    case source.kind === "debt_credit":
    case source.kind === "debt_loan":
    case source.kind === "debt_personal":
    case source.kind === "external_expense":
    case source.kind === "external_income":
    case source.kind === "system_historic":
      return source
    default:
      return target
  }
}

function amountColorCode(source: Account, target: Account): number {
  switch (true) {
    case source.kind === "debt_credit":
    case source.kind === "debt_loan":
    case source.kind === "debt_personal":
    case source.kind === "external_expense":
    case source.kind === "external_income":
    case source.kind === "system_historic":
      return 1
    case target.kind === "debt_credit":
    case target.kind === "debt_loan":
    case target.kind === "debt_personal":
    case target.kind === "external_expense":
    case target.kind === "external_income":
    case target.kind === "system_historic":
      return -1
    default:
      return 0
  }
}

export const Entry = memo(function Entry({
  transaction,
  source,
  sourceParent = null,
  target,
  targetParent = null
}: Props) {
  const start = account(source, target)
  const dest = start.id === source.id ? target : source
  const startParent = start.parentId === sourceParent?.id
    ? sourceParent
    : start.parentId === targetParent?.id
      ? targetParent
      : null
  const amount = dest.id === transaction.sourceId
    ? transaction.sourceAmount
    : transaction.targetAmount
  const destParent = dest.parentId === sourceParent?.id
    ? sourceParent
    : dest.parentId === targetParent?.id
      ? targetParent
      : null

  return (
    <span className={cn(
      "flex gap-2 items-stretch py-2",
      (!transaction.executedAt || isFuture(transaction.executedAt)) &&
      "relative before:absolute before:inset-0 before:bg-background/50"
    )}>
      <span
        className={cn(
          "row-span-2 [&_svg]:size-7 flex items-center justify-center aspect-square rounded-lg h-12",
          (start.kind === "external_expense" || start.kind === "external_income") && "rounded-full"
        )}
        style={{
          backgroundColor: start.color,
          color: colorContrast(start.color)
        }}
      >
        {icons[start.icon]}
      </span>
      <span className="grow space-y-1">
        <span>{accountName(start, startParent)}</span>
        <div className="flex gap-1 col-span-2 items-center text-xs [&_svg]:size-4 text-muted-foreground">
          <span>{icons[dest.icon]}</span>
          <span>{accountName(dest, destParent)}</span>
        </div>
      </span>
      <span className={cn("text-right", currencyAmountColor(amountColorCode(source, target)))}>
        {currencyAmountToHuman(amount, dest.currency)}
      </span>
    </span>
  )
})
