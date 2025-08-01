import { isFuture } from "date-fns";
import { NotepadText } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useMemo } from "react";
import { Link, useLocation, useResolvedPath } from "react-router";
import { cn } from "~/lib/utils";
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Account } from "../types/accounts";
import { Transaction } from "../types/transactions";

interface Props {
  transaction: Transaction
  source: Account
  sourceParent?: Account | null
  target: Account
  targetParent?: Account | null
  futureEnable?: boolean
}

function accountName(account: Account, parent: Account | null): string {
  if (!parent) return account.name

  return `${parent.name} (${account.name})`
}

function account(source: Account, target: Account, transaction: Transaction): Account {
  if (transaction.metadata.kind === "expense") return target
  if (transaction.metadata.kind === "income") return source

  return target
}

function amountColorCode(transaction: Transaction): number {
  switch (transaction.metadata.kind) {
    case "income":
      return 1
    case "expense":
      return -1
    default:
      return 0
  }
}

export function Entry({
  transaction,
  source,
  sourceParent = null,
  target,
  targetParent = null,
  futureEnable = false
}: Props) {
  const { pathname } = useResolvedPath(`./${transaction.id}`, { relative: "path" })
  const { search, hash } = useLocation()
  const start = account(source, target, transaction)
  const dest = start.id === source.id ? target : source
  const startParent = start.parentId === sourceParent?.id
    ? sourceParent
    : start.parentId === targetParent?.id
      ? targetParent
      : null
  const destParent = dest.parentId === sourceParent?.id
    ? sourceParent
    : dest.parentId === targetParent?.id
      ? targetParent
      : null

  const inTheFuture = useMemo(() => {
    return transaction.executedAt && isFuture(transaction.executedAt)
  }, [transaction?.executedAt])

  const amountColor = currencyAmountColor(amountColorCode(transaction))

  return (
    <Link
      to={{ pathname, search, hash }}
      className={cn(
        "grid grid-cols-[min-content_1fr_1fr] items-top gap-1 py-2.5 px-2 hover:border-foreground! cursor-pointer relative border border-transparent rounded-lg",
        futureEnable && inTheFuture && "opacity-75"
      )}
    >
      <AccountListingIcon
        kind={start.kind}
        icon={start.icon}
        color={start.color}
        main={start.main}
        className="size-8 [&_svg]:size-6 z-0"
      />
      <div>
        <span className="mb-1.5 flex gap-2 items-center">
          <span className="leading-none">
            {accountName(start, startParent)}
          </span>
          {
            transaction.notes !== null && transaction.notes.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground cursor-pointer">
                    <NotepadText />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[25dvw]">
                  {transaction.notes}
                </TooltipContent>
              </Tooltip>
            )
          }
        </span>
        <div className="flex gap-1 items-center text-xs [&_svg]:size-4 text-muted-foreground">
          <span className="leading-none">
            <DynamicIcon name={dest.icon} />
          </span>
          <span>
            {accountName(dest, destParent)}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <span className={cn("text-right leading-none", amountColor)}>
          {currencyAmountToHuman(transaction.targetAmount, transaction.currency)}
        </span>
        {
          transaction.currency !== dest.currency && (
            <span className={cn("text-right text-xs leading-none", amountColor)}>
              {currencyAmountToHuman(transaction.sourceAmount, dest.currency as Currency)}
            </span>
          )
        }
      </div>
    </Link>
  )
}
