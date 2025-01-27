import { StarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";

export function MainAccount() {
  return (
    <Tooltip>
      <TooltipTrigger className="[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <StarIcon />
      </TooltipTrigger>
      <TooltipContent>
        This is your main Account
      </TooltipContent>
    </Tooltip>
  )
}