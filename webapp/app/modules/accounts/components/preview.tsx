import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Account } from "../types/account";

interface Props {
  account: Account
}

export function Preview({ account, className, ...props }: ComponentProps<"div"> & Props) {
  const debt = account.capital + account.additionalData.balance

  return (
    <div
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer",
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
      <div className="flex flex-col gap-1 [&_>*]:leading-none">
        <p>{account.name}</p>
        <p className="text-muted-foreground text-xs">{account.description}</p>
      </div>
      <p className="text-sm">
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
      </p>
    </div>
  )
}