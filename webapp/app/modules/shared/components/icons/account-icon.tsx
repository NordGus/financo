import { StarIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { colorContrast } from "../../helpers/color-contrast";
import { Kind } from "../../types/account";
import { Icon } from "../../types/icon";

interface ListingProps {
  kind: Kind
  icon: Icon
  color: string
  main?: boolean
}

export function AccountListingIcon({ kind, icon, color, main = false, className, ...props }: ComponentProps<"span"> & ListingProps) {
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
        main && <span className="absolute -top-1.5 -right-1.5 p-0.5 bg-primary rounded-full">
          <StarIcon className="!size-4 text-primary-foreground" />
        </span>
      }
    </span>
  )
}