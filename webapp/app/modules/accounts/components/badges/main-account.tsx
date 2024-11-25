import { StarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";

export function MainAccount() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <StarIcon />
      </TooltipTrigger>
      <TooltipContent>
        main account
      </TooltipContent>
    </Tooltip>
  )
}