import { endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { PropsWithChildren, useMemo } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer"
import { Period } from "../../types/transactions"
import { PeriodIcon } from "../period-icon"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenRangePicker: (open: boolean) => void
  onOpenDayPicker: (open: boolean) => void
  onFilterChange: (from: Date | undefined, to: Date | undefined, period: Period) => void
  submitting: boolean
}

function DatePreview({ children }: PropsWithChildren) {
  return (
    <span className="block text-muted-foreground text-xs">
      {children}
    </span>
  )
}

export function PeriodShortcuts({
  open,
  onOpenChange,
  onOpenRangePicker,
  onOpenDayPicker,
  onFilterChange,
  submitting
}: Props) {
  const today = useMemo(() => new Date(), [open])

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Period</DrawerTitle>
            <DrawerDescription className="hidden" data-hidden>
              Select which period you want preview
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-1 px-4 h-[90dvh]">
            <Button
              variant={"secondary"}
              className="col-span-2 rounded-t-2xl"
              onClick={() => onOpenRangePicker(true)}
              disabled={submitting}
            >
              <PeriodIcon period="custom" />
              Select Range
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onFilterChange(undefined, undefined, "unlimited")}
              disabled={submitting}
            >
              <PeriodIcon period="unlimited" /> Entire Ledger
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onOpenDayPicker(true)}
              disabled={submitting}
            >
              <CalendarIcon /> Select Day
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onFilterChange(startOfWeek(today), endOfWeek(today), "weekly")}
              disabled={submitting}
            >
              <PeriodIcon period="weekly" />
              <span>
                Week
                <DatePreview>
                  {format(startOfWeek(today), "MMM do")} - {format(endOfWeek(today), "MMM do")}
                </DatePreview>
              </span>
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onFilterChange(today, today, "daily")}
              disabled={submitting}
            >
              <PeriodIcon period="daily" />
              <span>
                Today
                <DatePreview>
                  {format(today, "MMM do")}
                </DatePreview>
              </span>
            </Button>
            <Button
              variant={"secondary"}
              className="rounded-bl-2xl"
              onClick={() => onFilterChange(startOfYear(today), endOfYear(today), "yearly")}
              disabled={submitting}
            >
              <PeriodIcon period="yearly" from={today} />
              <span>
                Year
                <DatePreview>
                  {format(today, "yyyy")}
                </DatePreview>
              </span>
            </Button>
            <Button
              variant={"secondary"}
              className="rounded-br-2xl"
              onClick={() => onFilterChange(startOfMonth(today), endOfMonth(today), "monthly")}
              disabled={submitting}
            >
              <PeriodIcon period="monthly" from={today} />
              <span>
                Month
                <DatePreview>
                  {format(today, "MMMM yyyy")}
                </DatePreview>
              </span>
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant={"outline"} disabled={submitting}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}