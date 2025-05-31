import { Check } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "../../helpers/currency-amount-color";
import { currencyAmountToHuman } from "../../helpers/currency-amount-to-human";
import { AccountPreview } from "../../types/account";
import { AccountListingIcon } from "../icons/account-icon";

interface Props {
  account: AccountPreview
  selected?: boolean
}

export function Preview({ account, className, selected = false, ...props }: ComponentProps<"span"> & Props) {
  const debt = account.capital + account.balance

  return (
    <span
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer hover:bg-foreground relative",
          !!account.archivedAt && "before:absolute before:inset-0 before:bg-background/40 before:z-50",
          className
        )
      }
      {...props}
    >
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.main}
        className="row-span-2"
      />
      <span className="flex flex-col gap-1 [&_>*]:leading-none">
        <span>{account.name}</span>
        <span className="text-muted-foreground text-xs">{account.description}</span>
      </span>
      <span className="text-sm">
        {
          (account.kind === "capital" || account.kind === "savings") && (
            <span className={currencyAmountColor(account.balance)}>
              {currencyAmountToHuman(account.balance, account.currency)}
            </span>
          )
        }
        {
          account.kind === "debt" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency)}
              </span>{" "}
              <span>owed out of</span>{" "}
              <span className={currencyAmountColor(account.capital)}>
                {currencyAmountToHuman(account.capital, account.currency)}
              </span>
            </>
          )
        }
        {
          account.kind === "credit" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency)}
              </span>{" "}
              <span>owed with</span>{" "}
              <span className={currencyAmountColor(account.balance)}>
                {currencyAmountToHuman(account.balance, account.currency)}
              </span>{" "}
              <span>available</span>
            </>
          )
        }
      </span>
      {selected && <SelectedAccountBadge />}
    </span>
  )
}

function SelectedAccountBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex p-1 [&_svg]:size-4 rounded-full aspect-square absolute top-0 right-0 bg-muted", className)}
      {...props}
    >
      <Check />
    </span>
  )
}