import { BanknoteIcon, XIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Calculator } from "../calculator";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer";
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
    <Drawer>
      <DrawerTrigger asChild>
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
      </DrawerTrigger>
      <DrawerContent className="overflow-clip">
        <DrawerHeader className="hidden">
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription>Input the currency amount</DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-end px-2">
          <DrawerClose asChild>
            <Button type="button" variant={"link"} size={"icon"}>
              <XIcon />
            </Button>
          </DrawerClose>
        </div>
        <div className="px-4 pb-4">
          <Calculator
            initialValue={value}
            onChange={onChange}
            currency={currency}
            disableFlipSign={fixedSign}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}