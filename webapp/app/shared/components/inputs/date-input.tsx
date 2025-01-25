import { add, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ActiveModifiers } from "react-day-picker";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  value?: Date
  onSelect: (day: Date | undefined, selectedDay: Date, activeModifiers: ActiveModifiers, e: React.MouseEvent) => void
}

export function DateInput({ value, onSelect }: Props) {
  const disabledFrom = startOfDay(add(new Date(), { days: 1 }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full px-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? (format(value, "PPP")) : (<span>Pick a date</span>)}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          disabled={(date) => date >= disabledFrom}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}