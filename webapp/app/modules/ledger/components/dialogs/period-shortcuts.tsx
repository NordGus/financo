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
    <div className="grid grid-cols-2 gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer col-span-2"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onOpenRangePicker(true)}
            disabled={submitting}
          >
            Pick a Date Range
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="top">
          {"Transactions by a custom date range, you have to pick the date range"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onOpenDayPicker(true)}
            disabled={submitting}
          >
            Pick a Day
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="left">
          {"Transactions by calendar day, you have to pick the date"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onFilterChange(today, today, "daily")}
            disabled={submitting}
          >
            Today
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="right">
          {`Transactions by calendar day, starting at today ${format(today, "PPP")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onFilterChange(startOfWeek(today), endOfWeek(today), "weekly")}
            disabled={submitting}
          >
            Week
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="left">
          {`Transactions by calendar week, starting at the current week between ${format(startOfWeek(today), "PPP")} and ${format(endOfWeek(today), "PPP")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onFilterChange(startOfMonth(today), endOfMonth(today), "monthly")}
            disabled={submitting}
          >
            Month
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="right">
          {`Transaction by calendar month, staring at the current month of ${format(today, "MMMM, yyyy")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onFilterChange(startOfYear(today), endOfYear(today), "yearly")}
            disabled={submitting}
          >
            Year
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="left">
          {`Transaction by calendar year, staring at the current year of ${format(today, "yyyy")}`}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            size={"lg"}
            onClick={() => onFilterChange(undefined, undefined, "unlimited")}
            disabled={submitting}
          >
            Entire Ledger
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[15dvw]" side="right">
          {"All the Transactions in the ledger"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}