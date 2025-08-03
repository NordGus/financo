import { BanknoteIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Calculator } from "../calculator";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl } from "../ui/form";

interface Props {
  currency?: Currency
  value?: number
  onChange: (value?: number) => void
  name: string
  fixedSign?: boolean
  forDebts?: boolean
  disabled?: boolean
  placeholder?: string
}

export function CurrencyAmountInput({
  value,
  name,
  onChange,
  currency,
  fixedSign = false,
  forDebts = false,
  disabled = false,
  placeholder
}: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full px-3 text-left font-normal",
              currencyAmountColor(value ?? 0)
            )}
            disabled={disabled}
            type="button"
          >
            {
              value !== undefined && currency !== undefined
                ? (
                  <>
                    {currencyAmountToHuman(value, currency)}
                    {forDebts && value > 0 && <span className="ml-auto">{"I'm owed"}</span>}
                    {forDebts && value < 0 && <span className="ml-auto">{"I owe"}</span>}
                  </>
                )
                : (
                  <span>
                    {placeholder ?? "Set amount"}
                  </span>
                )
            }
            <BanknoteIcon
              className={cn(
                "h-4 w-4 text-muted-foreground",
                !forDebts && "ml-auto",
                forDebts && value === 0 && "ml-auto"
              )}
            />
          </Button>
        </FormControl>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>Input the currency amount</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4">
          <Calculator
            initialValue={value}
            onChange={onChange}
            currency={currency}
            disableFlipSign={fixedSign}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}