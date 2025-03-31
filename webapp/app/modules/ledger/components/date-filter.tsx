import { format } from "date-fns";
import { MoveHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/modules/shared/components/ui/button";
import { Period } from "../types/transactions";
import { MoveDateRange } from "./buttons/move-date-rage";
import { PeriodIcon } from "./period-icon";

const FORMAT_DATE_STRING = "LLL dd, y"

interface Props {
  range: DateRange
  period: Period
  onClick: () => void
  onForwards: () => void
  onBackwards: () => void
}

export function DateFilter({ range, period, onClick }: Props) {
  return (
    <div className="p-2 gap-2 flex border-b">
      {range.from && <MoveDateRange direction="backwards" />}
      <Button
        variant={"secondary"}
        className="grow"
        type="button"
        onClick={onClick}
      >
        <PeriodDisplay range={range} period={period} />
      </Button>
      {range.to && <MoveDateRange direction="forwards" />}
    </div>
  )
}

interface PeriodDisplayProps {
  range: DateRange
  period: Period
}

function PeriodDisplay({ range, period }: PeriodDisplayProps) {
  if (period === "unlimited")
    return (
      <>
        <PeriodIcon period={period} size={"sm"} /> {"Entire Ledger"}
      </>
    )

  const from = useMemo(() => format(range.from!, FORMAT_DATE_STRING), [range.from])
  const to = useMemo(() => format(range.to!, FORMAT_DATE_STRING), [range.to])

  return (
    <>
      <PeriodIcon period={period} size={"sm"} from={range.from} /> {from} <MoveHorizontalIcon /> {to}
    </>
  )
}