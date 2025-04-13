import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color"
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human"
import { Currency } from "~/modules/shared/types/currency"
import { Account } from "../../types/accounts"
import { SelectedAccountBadge } from "../badges/selected-account"

// TODO: Move to shared module and unify with all other implementations

interface Props {
  account: Account
  selected: boolean
}

export function PreviewAccount({ account, selected, className, ...props }: ComponentProps<"div"> & Props) {
  const debt = account.capital + account.balance

  return (
    <div
      className={cn("grid grid-cols-[min-content_1fr] gap-2 mb-1 cursor-pointer relative", className)}
      {...props}
    >
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.main}
        className="row-span-2"
      />
      <div className="flex flex-col gap-1 [&_>*]:leading-none">
        <p>{account.name}</p>
        <p className="text-muted-foreground text-xs">{account.description}</p>
      </div>
      <p className="text-sm">
        {
          (account.kind === "capital" || account.kind === "savings") && (
            <span className={currencyAmountColor(account.balance)}>
              {currencyAmountToHuman(account.balance, account.currency as Currency)}
            </span>
          )
        }
        {
          account.kind === "debt" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency as Currency)}
              </span>{" "}
              <span>owed out of</span>{" "}
              <span className={currencyAmountColor(account.capital)}>
                {currencyAmountToHuman(account.capital, account.currency as Currency)}
              </span>
            </>
          )
        }
        {
          account.kind === "credit" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, account.currency as Currency)}
              </span>{" "}
              <span>owed with</span>{" "}
              <span className={currencyAmountColor(account.balance)}>
                {currencyAmountToHuman(account.balance, account.currency as Currency)}
              </span>{" "}
              <span>available</span>
            </>
          )
        }
      </p>
      {selected && <SelectedAccountBadge />}
    </div>
  )
}