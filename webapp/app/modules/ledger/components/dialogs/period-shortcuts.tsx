import { endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { useMemo } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip"
import { Period } from "../../types/transactions"

interface Props {
  onOpenRangePicker: (open: boolean) => void
  onOpenDayPicker: (open: boolean) => void
  onFilterChange: (from: Date | undefined, to: Date | undefined, period: Period) => void
  submitting: boolean
}

export function PeriodShortcuts({
  onOpenRangePicker,
  onOpenDayPicker,
  onFilterChange,
  submitting
}: Props) {
  const today = useMemo(() => new Date(), [open])

  return (
    <div className="flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onOpenRangePicker(true)}
            disabled={submitting}
          >
            Pick a Date Range
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {"Transactions by a custom date range, you have to pick the date range"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onOpenDayPicker(true)}
            disabled={submitting}
          >
            Pick a Day
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {"Transactions by calendar day, you have to pick the date"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onFilterChange(today, today, "daily")}
            disabled={submitting}
          >
            Today
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {`Transactions by calendar day, starting at today ${format(today, "PPP")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onFilterChange(startOfWeek(today), endOfWeek(today), "weekly")}
            disabled={submitting}
          >
            Week
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {`Transactions by calendar week, starting at the current week between ${format(startOfWeek(today), "PPP")}} and ${format(endOfWeek(today), "PPP")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onFilterChange(startOfMonth(today), endOfMonth(today), "monthly")}
            disabled={submitting}
          >
            Month
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {`Transaction by calendar month, staring at the current month of ${format(today, "MMMM, yyyy")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onFilterChange(startOfYear(today), endOfYear(today), "yearly")}
            disabled={submitting}
          >
            Year
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {`Transaction by calendar year, staring at the current year of ${format(today, "yyyy")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => onFilterChange(undefined, undefined, "unlimited")}
            disabled={submitting}
          >
            Entire Ledger
          </Button>
        </TooltipTrigger>
        <TooltipContent side={"right"}>
          {"All the Transactions in the ledger"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}