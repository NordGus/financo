import { PackageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";

export function ArchivedAccount() {
  return (
    <Tooltip>
      <TooltipTrigger className="[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
        <PackageIcon />
      </TooltipTrigger>
      <TooltipContent>
        This Account is archived
      </TooltipContent>
    </Tooltip>
  )
}