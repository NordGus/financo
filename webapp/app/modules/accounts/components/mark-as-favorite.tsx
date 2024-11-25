import { StarIcon, StarOffIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip"

interface Props {
  favorite: boolean
  id: number
}

// TODO: implement form action
export function MarkAsFavorite({ favorite }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="link" className="text-yellow-500">
          {
            favorite
              ? <StarOffIcon />
              : <StarIcon />
          }
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        favorite
      </TooltipContent>
    </Tooltip>
  )
}