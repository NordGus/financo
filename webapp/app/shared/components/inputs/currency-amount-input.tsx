import { BanknoteIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/shared/helpers/currency-amount-to-human";
import { Currency } from "~/shared/types/currency";
import { Calculator } from "../calculator";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl } from "../ui/form";

interface Props {
  currency: Currency
  value?: number
  onChange: (value?: number) => void
  name: string
  fixedSign?: boolean
  forDebts?: boolean
}

export function CurrencyAmountInput({
  value = 0, name, onChange, currency, fixedSign = false, forDebts = false
}: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full px-3 text-left font-normal",
              currencyAmountColor(value)
            )}
          >
            {currencyAmountToHuman(value, currency)}
            {forDebts && value > 0 && <span className="ml-auto">I&apos;m owed</span>}
            {forDebts && value < 0 && <span className="ml-auto">I owe</span>}
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
      <DialogContent className="max-w-[400px] overflow-clip">
        <DialogHeader>
          <DialogTitle className="hidden">{name}</DialogTitle>
        </DialogHeader>
        <Calculator
          initialValue={value}
          onChange={onChange}
          currency={currency}
          disableFlipSign={fixedSign}
        />
      </DialogContent>
    </Dialog>
  )
}