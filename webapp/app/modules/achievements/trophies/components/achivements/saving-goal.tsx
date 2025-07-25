import { PiggyBank } from "lucide-react"
import { Link, useLocation } from "react-router"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip"
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human"
import { Currency } from "~/modules/shared/types/currency"

type Props = {
  id: number
  name: string
  description: string | null | undefined
  saved: number
  currency: Currency
}

export function SavingsGoal({ id, name, description, saved, currency }: Props) {
  const { search } = useLocation()

  return (
    <Link
      to={{ pathname: `savings-goals/${id}`, search }}
      data-slot="card"
      className="bg-card text-card-foreground flex rounded-xl border hover:border-foreground py-6 shadow-sm overflow-clip"
    >
      <span className="pl-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <PiggyBank className="size-10" />
          </TooltipTrigger>
          <TooltipContent>
            Savings Goal
          </TooltipContent>
        </Tooltip>
      </span>
      <span className="flex flex-col gap-6">
        <span
          data-slot="card-header"
          className="flex flex-col gap-1.5 px-6"
        >
          <span
            data-slot="card-title"
            className="leading-none font-semibold"
          >
            {name}
          </span>
          <span
            data-slot="card-description"
            className="text-muted-foreground text-sm"
          >
            {description}
          </span>
        </span>
        <span
          data-slot="card-footer"
          className="flex items-center px-6"
        >
          <span>
            {"you successfully saved "}
            <span className="font-bold">
              {currencyAmountToHuman(saved, currency)}
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}