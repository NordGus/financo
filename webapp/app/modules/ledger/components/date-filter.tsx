import { format } from "date-fns";
import { MoveHorizontalIcon } from "lucide-react";
import { ComponentProps, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/modules/shared/components/ui/button";
import { useFilters } from "../hooks/use-filters";
import { Period } from "../types/transactions";
import { PeriodIcon } from "./period-icon";

const FORMAT_DATE_STRING = "LLL dd, y"

export function DateFilter({ ...props }: ComponentProps<typeof Button>) {
  const [{ to, from, period },] = useFilters()

  return (
    <Button
      variant={"ghost"}
      type="button"
      {...props}
    >
      <PeriodDisplay range={{ to, from }} period={period} />
    </Button>
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