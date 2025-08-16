import { format } from "date-fns";
import { PropsWithChildren } from "react";
import { Heading5 } from "~/modules/shared/components/ui/headings";

interface Props {
  date: string
}

export function DateGroup({ date, children }: PropsWithChildren<Props>) {
  return (
    <>
      <div className="sticky top-0 flex items-center justify-between bg-background z-10 py-1.5 px-2">
        <Heading5 className="text-muted-foreground">
          {format(date, "PPP")}
        </Heading5>
      </div>
      <div className={"flex flex-col gap-1.5"}>
        {children}
      </div>
    </>
  )
}
