import { StarIcon } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";

export function MainAccount() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="link" size="icon">
          <StarIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        main account
      </TooltipContent>
    </Tooltip>
  )
}