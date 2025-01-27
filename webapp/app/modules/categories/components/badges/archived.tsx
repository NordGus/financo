import { PackageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";

export function Archived() {
  return (
    <Tooltip>
      <TooltipTrigger className="[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <PackageIcon />
      </TooltipTrigger>
      <TooltipContent>
        This Category is archived
      </TooltipContent>
    </Tooltip>
  )
}