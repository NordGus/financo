import { cva, type VariantProps } from "class-variance-authority";
import { HourglassIcon } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";

const throbberVariants = cva(
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "[&_svg]:size-5",
        sm: "[&_svg]:size-4",
        lg: "[&_svg]:size-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export function Throbber({ size, className }: ComponentProps<"span"> & VariantProps<typeof throbberVariants>) {
  return (
    <span
      className={cn(throbberVariants({ size, className }))}
    >
      <HourglassIcon className="animate-throbber" />
    </span>
  )
}

export function FullScreenThrobber({ className }: ComponentProps<"div">) {
  return (
    <div className={cn("h-full flex justify-center items-center bg-background/50", className)}>
      <Throbber />
    </div>
  );
}
