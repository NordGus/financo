import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, MoveHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/modules/shared/components/ui/button";
import { Period } from "../types/transactions";
import { PeriodIcon } from "./period-icon";

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
  if (period === "unlimited")
    return <><PeriodIcon period={period} size={"sm"} /> Entire Ledger</>

  const from = useMemo(() => format(range.from!, FORMAT_DATE_STRING), [range.from])
  const to = useMemo(() => format(range.to!, FORMAT_DATE_STRING), [range.to])

  return <>
    <PeriodIcon period={period} size={"sm"} from={range.from} /> {from} <MoveHorizontalIcon /> {to}
  </>
}

export function DateFilter({ range, period, onClick, onForwards, onBackwards }: Props) {
  return (
    <div className="p-2 gap-2 flex border-b">
      {
        range.from && (
          <Button
            variant={"secondary"}
            onClick={onBackwards}
            size={"icon"}
          >
            <ChevronLeftIcon />
          </Button>
        )
      }
      <Button
        variant={"secondary"}
        className="flex-grow"
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
            size={"icon"}
          >
            <ChevronRightIcon />
          </Button>
        )
      }
    </div>
  )
}
