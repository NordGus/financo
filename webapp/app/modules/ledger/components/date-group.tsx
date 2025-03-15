import { format } from "date-fns";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

interface Props {
  date: string
  isFirst: boolean
}

export function DateGroup({ date, isFirst, children }: PropsWithChildren<Props>) {
  return (
    <>
      <div className={cn("flex items-center justify-between border-b py-2 px-4", !isFirst && "border-t")}>
        <p className="text-muted-foreground">
          {format(date, "PPP")}
        </p>
      </div>
      <div className="flex flex-col px-4 py-2">
        {children}
      </div>
    </>
  )
}