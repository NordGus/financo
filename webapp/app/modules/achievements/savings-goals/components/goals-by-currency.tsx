import { Heading3 } from "~/modules/shared/components/ui/headings";
import { useCurrencies } from "~/modules/shared/hooks/use-currencies";
import { Currency } from "~/modules/shared/types/currency";
import { SavingsGoal } from "../types/savings-goal";

type Props = {
  currency: Currency
  goals: SavingsGoal[]
}

export function GoalsByCurrency({ currency, goals }: Props) {
  const { currenciesMap } = useCurrencies()

  return (
    <>
      <Heading3> {currenciesMap.get(currency)!.name}</Heading3>
      {
        goals.map((goal) => (
          <span key={goal.id}>{goal.name}</span>
        ))
      }
    </>
  )
}