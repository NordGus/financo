import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ComponentProps } from "react"
import { createSearchParams, Link, useSearchParams } from "react-router"
import { Button } from "~/modules/shared/components/ui/button"
import { calculateDateRangeMovement, Movement } from "../../helpers/calculate-date-range-movement"
import { useFilters } from "../../hooks/use-filters"
import { updateURLSearchParams } from "../../types/filters"

type Direction = "forwards" | "backwards"

type Props = {
  direction: Direction
}

export function MoveDateRange({ direction, ...props }: ComponentProps<"button"> & Props) {
  const { filters } = useFilters()
  const [searchParams,] = useSearchParams()

  if (!filters.from || !filters.to) return null

  const { from, to } = direction === "forwards"
    ? calculateDateRangeMovement(Movement.Forwards, filters.from, filters.to, filters.period)
    : calculateDateRangeMovement(Movement.Backwards, filters.to, filters.from, filters.period)

  const newSearchParams = createSearchParams(
    updateURLSearchParams(searchParams, { ...filters, from, to })
  )

  return (
    <Button
      variant={"secondary"}
      size={"icon"}
      {...props}
      asChild
    >
      <Link to={"?" + newSearchParams} discover="render" prefetch="viewport" replace>
        {
          direction === "forwards" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )
        }
      </Link>
    </Button>
  )
}