import { Check } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function SelectedAccountBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex p-1 [&_svg]:size-4 rounded-full aspect-square absolute top-0 right-0 bg-muted", className)}
      {...props}
    >
      <Check />
    </span>
  )
}