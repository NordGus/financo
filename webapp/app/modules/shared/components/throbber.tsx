import { cva, type VariantProps } from "class-variance-authority";
import { HourglassIcon } from "lucide-react";
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

interface ThrobberProps extends VariantProps<typeof throbberVariants> {
  className?: string
}

export function Throbber({ size, className }: ThrobberProps) {
  return (
    <span
      className={cn(throbberVariants({ size, className }))}
    >
      <HourglassIcon className="animate-throbber" />
    </span>
  )
}