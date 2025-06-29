import { PackageIcon, StarIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { colorContrast } from "../../helpers/color-contrast";
import { Kind } from "../../types/account";
import { Icon } from "../../types/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ListingProps {
  kind: Kind
  icon: Icon
  color: string
  main?: boolean
  archived?: boolean
}

export function AccountListingIcon({
  kind,
  icon,
  color,
  main = false,
  archived = false,
  className,
  ...props
}: ComponentProps<"span"> & ListingProps) {
  return (
    <span
      className={
        cn(
          "size-9 [&_svg]:size-7 flex justify-center items-center rounded-lg relative",
          (kind === "income" || kind === "expense") && "rounded-full",
          className
        )
      }
      style={{ backgroundColor: color }}
      {...props}
    >
      <DynamicIcon name={icon} color={colorContrast(color)} />
      {
        main && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute -top-2 -right-2 p-0.5 bg-primary rounded-full border-accent border-[1px]">
                <StarIcon className="!size-4 text-primary-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {"This is your main Account"}
            </TooltipContent>
          </Tooltip>
        )
      }
      {
        archived && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute -bottom-2 -left-2 p-0.5 bg-primary rounded-full border-accent border-[1px]">
                <PackageIcon className="!size-4 text-primary-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {
                ["income", "expense"].includes(kind)
                  ? "This Category is archived"
                  : "This Account is archived"
              }
            </TooltipContent>
          </Tooltip>
        )
      }
    </span>
  )
}