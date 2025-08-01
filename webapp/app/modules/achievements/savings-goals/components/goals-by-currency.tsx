import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/modules/shared/components/ui/button";
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

  const name = useMemo(() => currenciesMap.get(currency)!.name, [currency, currenciesMap])
  const { search, hash } = useLocation()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading3>{name}</Heading3>
        <Button variant={"ghost"} asChild>
          <Link to={{ pathname: "new", search, hash }}>
            <Plus /> New Goal
          </Link>
        </Button>
      </div>
      {
        goals.map((goal) => (
          <Link key={goal.id} to={{ pathname: goal.id.toString(), search, hash }}>
            <span key={goal.id}>{goal.name}</span>
          </Link>
        ))
      }
    </>
  )
}