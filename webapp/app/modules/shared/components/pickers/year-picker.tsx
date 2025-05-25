import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

interface YearPickerProps {
  value?: Date
  onChange: (date: Date) => void
  defaultYear?: number
  className?: string
}

export function YearPicker({ value, onChange, defaultYear = new Date().getFullYear(), className }: YearPickerProps) {
  const [selectedYear, setSelectedYear] = useState<number>(value ? value.getFullYear() : defaultYear)
  const [yearRange, setYearRange] = useState<number[]>([])

  // Generate the range of years to display
  const generateYearRange = (centerYear: number) => {
    const years = []
    const startYear = centerYear - 7
    const endYear = centerYear + 7

    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }

    return years
  }

  // Initialize or update the year range when the selected year changes
  useEffect(() => {
    setYearRange(generateYearRange(selectedYear))
  }, [selectedYear])

  useEffect(() => {
    if (!value) return
    if (value.getFullYear() === selectedYear) return

    setSelectedYear(value.getFullYear())
  }, [value?.toDateString()])

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)

    // Create a new date set to January 1st of the selected year
    onChange(new Date(year, 0, 1))
  }

  // Navigate to previous set of years
  const handlePrevious = () => {
    const newCenterYear = yearRange[0] - 8
    setYearRange(generateYearRange(newCenterYear))
  }

  // Navigate to next set of years
  const handleNext = () => {
    const newCenterYear = yearRange[yearRange.length - 1] + 8
    setYearRange(generateYearRange(newCenterYear))
  }

  return (
    <div className={cn("w-auto p-0", className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous years</span>
        </Button>
        <div className="text-sm font-medium">
          {yearRange[0]} - {yearRange[yearRange.length - 1]}
        </div>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next years</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2">
        {yearRange.map((year) => (
          <Button
            key={year}
            variant={year === selectedYear ? "default" : "outline"}
            className="h-8"
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  )
}