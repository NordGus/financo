import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

const MONTHS = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
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
    if (value.getFullYear() === year && value.getMonth()) return

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
    <div className={cn("w-auto p-0", className)}>
      <div className="flex items-center justify-between p-2 border-b">
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
      <div className="grid grid-cols-3 gap-2 p-2">
        {MONTHS.map((entry) => (
          <Button
            key={`${year}.${entry.value}`}
            variant={month === entry.value ? "default" : "outline"}
            className="h-8"
            onClick={() => handleMonthSelect(entry.value)}
          >
            {entry.name}
          </Button>
        ))}
      </div>
    </div>
  )
}