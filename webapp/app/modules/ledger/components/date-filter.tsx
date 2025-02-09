import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, InfinityIcon, MoveHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/modules/shared/components/ui/button";
import { Period } from "../types/transactions";

const FORMAT_DATE_STRING = "LLL dd, y"

interface Props {
  range: DateRange
  period: Period
  onClick: () => void
  onForwards: () => void
  onBackwards: () => void
}

interface PeriodDisplayProps {
  range: DateRange
  period: Period
}

function PeriodDisplay({ range, period }: PeriodDisplayProps) {
  if (period !== "unlimited" && (!range.from || !range.to))
    throw new Error(
      "invalid PeriodDisplay state",
      { cause: `${!range.from ? "from" : "to"} is undefined for period "${period}"` }
    )

  if (period === "unlimited")
    return <> <InfinityIcon /> Entire Ledger</>

  const from = useMemo(() => format(range.from!, FORMAT_DATE_STRING), [range.from])
  const to = useMemo(() => format(range.to!, FORMAT_DATE_STRING), [range.to])

  return <>
    {from} <MoveHorizontalIcon /> {to}
  </>
}

export function DateFilter({ range, period, onClick, onForwards, onBackwards }: Props) {
  return (
    <div className="p-4 gap-2 flex">
      {
        range.from && (
          <Button
            variant={"secondary"}
            onClick={onBackwards}
            className="shadow-lg aspect-square"
          >
            <ChevronLeftIcon />
          </Button>
        )
      }
      <Button
        variant={"secondary"}
        className="shadow-lg w-full gap-1"
        type="button"
        onClick={onClick}
      >
        <PeriodDisplay range={range} period={period} />
      </Button>
      {
        range.to && (
          <Button
            variant={"secondary"}
            onClick={onForwards}
            className="shadow-lg aspect-square"
          >
            <ChevronRightIcon />
          </Button>
        )
      }
    </div>
  )
}
