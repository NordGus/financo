import { useCurrenciesStore } from "~/modules/currencies/stores/currencies";
import { Currency } from "~/modules/shared/types/currency";
import { Throbber } from "../throbber";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  defaultValue?: Currency
  onValueChange: (value: Currency) => void
}

export function CurrencyInput({ onValueChange, defaultValue }: Props) {
  const currencies = useCurrenciesStore((state) => state.currencies)

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger>
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