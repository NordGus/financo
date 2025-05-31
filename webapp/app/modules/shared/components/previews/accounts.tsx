import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "../../helpers/currency-amount-color";
import { currencyAmountToHuman } from "../../helpers/currency-amount-to-human";
import { Account } from "../../types/account";
import { AccountListingIcon } from "../icons/account-icon";

interface Props {
  account: Account
}

export function Preview({ account, className, ...props }: ComponentProps<"span"> & Props) {
  const debt = account.capital + account.additionalData.balance

  return (
    <span
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer hover:bg-foreground",
          !!account.archivedAt && "relative before:absolute before:inset-0 before:bg-background/40 before:z-50",
          className
        )
      }
      {...props}
    >
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.additionalData.main}
        className="row-span-2"
      />
      <span className="flex flex-col gap-1 [&_>*]:leading-none">
        <span>{account.name}</span>
        <span className="text-muted-foreground text-xs">{account.description}</span>
      </span>
      <span className="text-sm">
        {
          (account.kind === "capital" || account.kind === "savings") && (
            <span className={currencyAmountColor(account.additionalData.balance)}>
              {currencyAmountToHuman(account.additionalData.balance, account.currency)}
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
              <span className={currencyAmountColor(account.additionalData.balance)}>
                {currencyAmountToHuman(account.additionalData.balance, account.currency)}
              </span>{" "}
              <span>available</span>
            </>
          )
        }
      </span>
    </span>
  )
}