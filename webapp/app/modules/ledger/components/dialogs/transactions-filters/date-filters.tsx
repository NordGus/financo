import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns"
import { Period } from "~/modules/ledger/types/filters"
import { Calendar } from "~/modules/shared/components/ui/calendar"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/modules/shared/components/ui/dialog"

const NUMBER_OF_MONTHS_IN_CALENDAR = 3

interface Props {
  from?: Date
  to?: Date
  period: Period
  onDatesChange: (from: Date | undefined, to: Date | undefined) => void
}

export function DateFilters({ from, to, period, onDatesChange }: Props) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {"Filter Transactions"}
        </DialogTitle>
        <DialogDescription>
          {"Select the periods you want to filter the ledger's Transactions by"}
        </DialogDescription>
      </DialogHeader>
      <div className="flex-1 flex items-center justify-center">
        {
          period === "custom" && (
            <Calendar
              mode="range"
              numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
              defaultMonth={from}
              selected={{ from: from, to: to }}
              onSelect={(range) => onDatesChange(range?.from ?? from, range?.to ?? to)}
            />
          )
        }
        {
          period === "daily" && (
            <Calendar
              mode="single"
              numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
              defaultMonth={to}
              selected={to}
              onSelect={(day) => onDatesChange(day ?? from, day ?? to)}
            />
          )
        }
        {
          period === "weekly" && (
            <Calendar
              mode="range"
              numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
              defaultMonth={from}
              selected={{
                from: !from ? undefined : startOfWeek(from),
                to: !from ? undefined : endOfWeek(from)
              }}
              onSelect={(range) => {
                if (range === undefined || range.from === undefined || range.to === undefined) {
                  onDatesChange(startOfWeek(from!), endOfWeek(from!))
                  return
                }

                if (from?.toDateString() === range.from.toDateString()) {
                  onDatesChange(startOfWeek(range.to), endOfWeek(range.to))
                  return
                }

                onDatesChange(startOfWeek(range.from), endOfWeek(range.from))
              }}
            />
          )
        }
        {
          period === "monthly" && (
            <Calendar
              mode="range"
              numberOfMonths={NUMBER_OF_MONTHS_IN_CALENDAR}
              defaultMonth={from}
              selected={{
                from: !from ? undefined : startOfMonth(from),
                to: !from ? undefined : endOfMonth(from)
              }}
              onSelect={(range) => {
                if (range === undefined || range.from === undefined || range.to === undefined) {
                  onDatesChange(startOfMonth(from!), endOfMonth(from!))
                  return
                }

                if (from?.toDateString() === range.from.toDateString()) {
                  onDatesChange(startOfMonth(range.to), endOfMonth(range.to))
                  return
                }

                onDatesChange(startOfMonth(range.from), endOfMonth(range.from))
              }}
            />
          )
        }
        {
          period === "yearly" && (
            <span>Here goes a year selector</span>
          )
        }
      </div>
    </>
  )
}