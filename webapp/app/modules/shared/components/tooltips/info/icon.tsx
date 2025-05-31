import { Info } from "lucide-react";
import { PropsWithChildren } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export function InfoTooltipIcon({ children }: PropsWithChildren) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex justify-center items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0"
      >
        <Info />
      </TooltipTrigger>
      <TooltipContent>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}