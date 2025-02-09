import { format } from "date-fns";
import { PropsWithChildren } from "react";
import { Heading5 } from "~/modules/shared/components/ui/headings";

interface Props {
  date: string
}

export function DateGroup({ date, children }: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-2">
        <Heading5 className="text-muted-foreground">
          {format(date, "PPP")}
        </Heading5>
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  )
}