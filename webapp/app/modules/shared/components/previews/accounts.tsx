import { Check } from "lucide-react";
import { ComponentProps, memo } from "react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "../../helpers/currency-amount-color";
import { currencyAmountToHuman } from "../../helpers/currency-amount-to-human";
import { AccountKind } from "../../types/account";
import { Currency } from "../../types/currency";
import { Icon } from "../../types/icon";
import { AccountListingIcon } from "../icons/account-icon";

interface Props {
  kind: AccountKind
  currency: Currency
  name: string
  description: string | null | undefined
  color: string
  icon: Icon
  capital: number
  balance: number
  main: boolean
  archivedAt: string | null | undefined
  selected?: boolean
}

export const Preview = memo(function Preview({
  kind,
  currency,
  name,
  description,
  color,
  icon,
  capital,
  balance,
  main,
  archivedAt,
  selected = false,
  className,
  ...props
}: ComponentProps<"span"> & Props) {
  const debt = capital + balance

  return (
    <span
      className={
        cn(
          "grid grid-cols-[min-content_1fr] gap-2 cursor-pointer hover:border-foreground! p-2.5 rounded-lg border border-transparent",
          !!archivedAt && "opacity-80",
          className
        )
      }
      {...props}
    >
      <AccountListingIcon
        kind={kind}
        icon={icon}
        color={color}
        main={main}
        archived={!!archivedAt}
        className="row-span-2"
      />
      <span className="flex flex-col gap-1 [&_>*]:leading-none">
        <span>{name}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </span>
      <span className="text-sm">
        {
          (kind === "capital" || kind === "savings") && (
            <span className={currencyAmountColor(balance)}>
              {currencyAmountToHuman(balance, currency)}
            </span>
          )
        }
        {
          kind === "debt" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, currency)}
              </span>{" "}
              <span>owed out of</span>{" "}
              <span className={currencyAmountColor(capital)}>
                {currencyAmountToHuman(capital, currency)}
              </span>
            </>
          )
        }
        {
          kind === "credit" && (
            <>
              <span className={currencyAmountColor(debt)}>
                {currencyAmountToHuman(debt, currency)}
              </span>{" "}
              <span>owed with</span>{" "}
              <span className={currencyAmountColor(balance)}>
                {currencyAmountToHuman(balance, currency)}
              </span>{" "}
              <span>available</span>
            </>
          )
        }
      </span>
      {selected && <SelectedAccountBadge className="top-2 right-2" />}
    </span>
  )
})

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