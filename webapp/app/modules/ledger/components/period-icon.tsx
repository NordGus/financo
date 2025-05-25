import { cva, type VariantProps } from "class-variance-authority";
import { getDaysInMonth, getDaysInYear } from "date-fns";
import { EllipsisIcon, InfinityIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Period } from "../types/transactions";

const iconVariants = cva(
  "border-2 rounded-lg border-foreground p-0.5 [&_svg]:pointer-events-none [&_svg]:size-7 [&_svg]:shrink-0 font-semibold min-w-7 text-center",
  {
    variants: {
      size: {
        default: "border-2",
        sm: "border [&_svg]:size-4 text-xs rounded-md min-w-5 font-normal",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface Props extends VariantProps<typeof iconVariants> {
  period: Period
  from?: Date
  className?: string
}

export function PeriodIcon({ period, from, size, className }: Props) {
  if (period === "unlimited") return <InfinityIcon />

  return (
    <span className={
      cn(iconVariants({ size, className }))
    }>
      {period === "custom" && (<EllipsisIcon />)}
      {period === "daily" && (<>1</>)}
      {period === "weekly" && (<>7</>)}
      {period === "monthly" && (<>{getDaysInMonth(from!)}</>)}
      {period === "yearly" && (<>{getDaysInYear(from!)}</>)}
    </span>
  )
}