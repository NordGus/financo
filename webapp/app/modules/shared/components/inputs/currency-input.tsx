import { use } from "react";
import { Currency } from "~/modules/shared/types/currency";
import { CurrenciesContext } from "../../contexts/currencies-context";
import { Throbber } from "../throbber";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  value: Currency
  defaultValue?: Currency
  onValueChange: (value: Currency) => void
}

export function CurrencyInput({ value, onValueChange, defaultValue }: Props) {
  const { currencies } = use(CurrenciesContext)

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue} value={value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={"Select a currency"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {
          currencies.length === 0
            ? <Throbber size="sm" />
            : currencies.map(({ code, name }) => (
              <SelectItem value={code} key={`currency.${code}`}>{name}</SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  )
}