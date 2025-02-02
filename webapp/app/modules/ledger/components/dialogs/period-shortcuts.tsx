import { endOfMonth, endOfWeek, endOfYear, format, getDaysInMonth, getDaysInYear, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { CalendarIcon, EllipsisIcon, InfinityIcon } from "lucide-react"
import { PropsWithChildren, useMemo } from "react"
import { cn } from "~/lib/utils"
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenRangePicker: (open: boolean) => void
  onOpenDayPicker: (open: boolean) => void
  onFilterChange: (from?: Date, to?: Date) => void
  submitting: boolean
}

function DatePreview({ children }: PropsWithChildren) {
  return (
    <span className="block text-muted-foreground text-xs">
      {children}
    </span>
  )
}

function Wrapper({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("border-2 rounded-lg border-foreground p-0.5", className)}>
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Period</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            Select which period you want preview
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 rounded-lg overflow-clip gap-1 px-4">
          <Button
            variant={"secondary"}
            size={"xl"}
            className="col-span-2"
            onClick={() => onOpenRangePicker(true)}
            disabled={submitting}
          >
            <Wrapper>
              <EllipsisIcon />
            </Wrapper>
            Select Range
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange()}
            disabled={submitting}
          >
            <InfinityIcon /> Always
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onOpenDayPicker(true)}
            disabled={submitting}
          >
            <CalendarIcon /> Select Day
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange(startOfWeek(today), endOfWeek(today))}
            disabled={submitting}
          >
            <Wrapper className="px-2">
              7
            </Wrapper>
            <span>
              Week
              <DatePreview>
                {format(startOfWeek(today), "MMM do")} - {format(endOfWeek(today), "MMM do")}
              </DatePreview>
            </span>
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange(today, today)}
            disabled={submitting}
          >
            <Wrapper className="px-2">
              1
            </Wrapper>
            <span>
              Today
              <DatePreview>
                {format(today, "MMM do")}
              </DatePreview>
            </span>
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange(startOfYear(today), endOfYear(today))}
            disabled={submitting}
          >
            <Wrapper className="px-1">
              {getDaysInYear(today)}
            </Wrapper>
            <span>
              Year
              <DatePreview>
                {format(today, "yyyy")}
              </DatePreview>
            </span>
          </Button>
          <Button
            variant={"secondary"}
            size={"xl"}
            onClick={() => onFilterChange(startOfMonth(today), endOfMonth(today))}
            disabled={submitting}
          >
            <Wrapper className="px-1.5">
              {getDaysInMonth(today)}
            </Wrapper>
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
  )
}