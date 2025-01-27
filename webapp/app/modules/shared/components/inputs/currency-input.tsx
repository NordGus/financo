import { isEmpty, isNil } from "lodash-es";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Currency } from "~/modules/shared/types/currency";
import { clientLoader } from "~/routes/currencies/for-select";
import { Throbber } from "../throbber";
import { FormControl } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  defaultValue?: Currency
  onValueChange: (value: Currency) => void
}

export function CurrencyInput({ onValueChange, defaultValue }: Props) {
  const fetcher = useFetcher<typeof clientLoader>({ key: "currencies.input" })

  useEffect(() => {
    const fetchCurrencies = async () => await fetcher.load("/currencies/for-select")

    fetchCurrencies()
  }, [])

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger>
          {
            fetcher.state !== "idle"
              ? <Throbber size="sm" />
              : <SelectValue placeholder={"Select a currency"} />
          }
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {
          isEmpty(fetcher.data?.currencies) || isNil(fetcher.data?.currencies)
            ? <Throbber size="sm" />
            : fetcher.data.currencies.map(({ code, name }) => (
              <SelectItem value={code} key={`currency.${code}`}>{name}</SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  )
}