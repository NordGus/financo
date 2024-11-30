import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { clientLoader } from "~/routes/currencies/for-select";
import { Currency } from "~/shared/types/currency";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  defaultValue?: Currency
  onValueChange: (value: Currency) => void
}

export function CurrencyInput({ onValueChange, defaultValue }: Props) {
  const fetcher = useFetcher<typeof clientLoader>({ key: "currencies.input" })
  const [currencies, setCurrencies] = useState(fetcher.data?.currencies || [])

  useEffect(() => {
    if (currencies.length !== 0) return;

    const fetchCurrencies = async () => {
      await fetcher.load("/currencies/for-select")

      setCurrencies(fetcher.data?.currencies || [])
    }

    fetchCurrencies()
  }, [currencies.length])

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={fetcher.state !== "idle" ? "Loading..." : "Select a currency"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {
          currencies.map(({ code, name }) => (
            <SelectItem value={code} key={`currency.${code}`}>{name}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}