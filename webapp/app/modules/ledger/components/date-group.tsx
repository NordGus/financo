import { format } from "date-fns";
import { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

interface Props {
  date: string
  isLast: boolean
}

export function DateGroup({ date, isLast, children }: PropsWithChildren<Props>) {
  return (
    <>
      <div className="sticky top-0 flex items-center justify-between border-b bg-background z-10 py-1.5 px-2 text-lg">
        <p className="text-muted-foreground">
          {format(date, "PPP")}
        </p>
      </div>
      <div className={cn("flex flex-col gap-1.5", !isLast && "border-b")}>
        {children}
      </div>
    </>
  )
}