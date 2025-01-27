import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import { currencyAmountColor as color } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman as amount } from "~/modules/shared/helpers/currency-amount-to-human";
import { isCredit, isDebt } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { ModuleKind } from "../../types/account";

interface Props {
  kind: ModuleKind
  capital: number
  balance: number
  currency: Currency
  className?: string
}

export function Balance({ kind, capital, balance, currency, className }: Props) {
  if (!isDebt(kind)) return (
    <Wrapper className={className}>
      <span className={cn("font-semibold", color(balance))}>
        {amount(balance, currency)}
      </span>
    </Wrapper>
  )

  if (capital === 0) return (
    <Wrapper className={className}>
      {balance > 0 && <span>I&apos;m owed</span>}
      {balance < 0 && <span>I&apos;m owe</span>}
      <span className={cn("font-semibold", color(balance))}>
        {amount(balance, currency)}
      </span>
    </Wrapper>
  )

  const debt = balance + capital

  if (debt === 0 && !isCredit(kind)) return (
    <Wrapper className={className}>
      <span className={cn("font-semibold", color(capital))}>
        {amount(capital, currency)}
      </span>
      <span>paid</span>
    </Wrapper>
  )

  if (debt === 0) return (
    <Wrapper className={className}>
      <span className={cn("font-semibold", color(capital))}>
        {amount(capital, currency)}
      </span>
      <span>available</span>
    </Wrapper>
  )

  return (
    <Wrapper className={className}>
      {debt > 0 && <span>I&apos;m owed</span>}
      {debt < 0 && <span>I owe</span>}
      <span className={cn("font-semibold", color(debt))}>
        {amount(debt, currency)}
      </span>
      <span>out of</span>
      <span className={cn("font-semibold", color(capital))}>
        {amount(capital, currency)}
      </span>
      {isCredit(kind) && (
        <>
          <br />
          <span>with</span>
          <span className={cn("font-semibold", color(balance))}>
            {amount(balance, currency)}
          </span>
          <span>available</span>
        </>
      )}
    </Wrapper>
  )
}

interface WrapperProps {
  className?: string
}

function Wrapper({ children, className }: PropsWithChildren<WrapperProps>) {
  return (
    <div className={cn("text-right space-x-1 text-sm", className)}>
      {children}
    </div>
  )
}