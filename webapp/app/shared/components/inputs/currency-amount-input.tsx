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
}

export function CurrencyAmountInput({ value, name, onChange, currency, fixedSign = false }: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full px-3 text-left font-normal",
              currencyAmountColor(value || 0)
            )}
          >
            {currencyAmountToHuman(value || 0, currency)}
            <BanknoteIcon className="ml-auto h-4 w-4 text-muted-foreground" />
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