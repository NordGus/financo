import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ComponentProps } from "react"
import { createSearchParams, Link, useNavigation, useSearchParams } from "react-router"
import { cn } from "~/lib/utils"
import { Button } from "~/modules/shared/components/ui/button"
import { calculateDateRangeMovement, Movement } from "../../helpers/calculate-date-range-movement"
import { useFilters } from "../../hooks/use-filters"
import { updateURLSearchParams } from "../../types/filters"

type Direction = "forwards" | "backwards"

type Props = {
  direction: Direction
}

export function MoveDateRangeLink({ direction, className, ...props }: ComponentProps<typeof Button> & Props) {
  const [filters,] = useFilters()
  const [searchParams,] = useSearchParams()
  const { state } = useNavigation()

  if (!filters.from || !filters.to) return null

  const { from, to } = direction === "forwards"
    ? calculateDateRangeMovement(Movement.Forwards, filters.from, filters.to, filters.period)
    : calculateDateRangeMovement(Movement.Backwards, filters.to, filters.from, filters.period)

  const newSearchParams = createSearchParams(updateURLSearchParams(searchParams, { ...filters, from, to }))

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={cn(className, "px-0")}
      asChild
      disabled={state !== "idle"}
    >
      <Link to={"?" + newSearchParams} prefetch="intent" replace>
        {direction === "forwards" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Link>
    </Button>
  )
}