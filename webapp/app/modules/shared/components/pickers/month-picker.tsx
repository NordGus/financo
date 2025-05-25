import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

interface Props {
  value?: Date
  onChange: (date: Date) => void
  defaultValue?: Date
  className?: string
}

export function MonthPicker({
  value,
  onChange,
  defaultValue = new Date,
  className,
}: Props) {
  const [year, setYear] = useState(value?.getFullYear() ?? defaultValue.getFullYear())
  const [month, setMonth] = useState(value?.getMonth() ?? defaultValue.getMonth())

  useEffect(() => {
    if (!value) return
    if (value.getFullYear() === year && value.getMonth() === month) return

    setYear(value.getFullYear())
    setMonth(value.getMonth())
  }, [value?.toDateString()])

  const handleMonthSelect = (selectedMonth: number) => {
    setMonth(selectedMonth)

    onChange(new Date(year, selectedMonth, 1))
  }

  const handlePreviousYear = () => setYear(prev => prev - 1)
  const handleNextYear = () => setYear(prev => prev + 1)

  return (
    <div className={cn("w-full min-w-[200px] p-0", className)}>
      <div className="flex items-center justify-between py-2 mt-2">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousYear}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous year</span>
        </Button>
        <div className="text-sm font-medium">
          {year}
        </div>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextYear}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next year</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 py-2">
        {MONTHS.map((entry, index) => (
          <Button
            key={`${year}.${index}`}
            variant={month === index ? "default" : "outline"}
            className="h-8"
            onClick={() => handleMonthSelect(index)}
          >
            {entry}
          </Button>
        ))}
      </div>
    </div>
  )
}