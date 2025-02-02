import { format } from "date-fns";
import { MoveHorizontalIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/modules/shared/components/ui/button";

const FORMAT_DATE_STRING = "LLL dd, y"

interface Props {
  range: DateRange
}

function Wrapper({ children }: PropsWithChildren) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex gap-4 justify-stretch w-full">
      {children}
    </div>
  )
}

export function DatePosting({ range }: Props) {
  // it has no buttons because it envelops infinity
  if (!range.from && !range.to) return (
    <Wrapper>
      <Button
        variant={"secondary"}
        className="shadow-lg w-full"
        type="button"
      >
        {"Entire Ledger"}
      </Button>
    </Wrapper>
  )

  // it has no buttons because it has an open limit to infinity
  if (!range.from || !range.to) {
    const date = range.from ?? range.to!

    return (
      <Wrapper>
        <Button
          variant={"secondary"}
          className="shadow-lg w-full"
          type="button"
        >
          {format(date, FORMAT_DATE_STRING)}
        </Button>
      </Wrapper>
    )
  }

  // it only move one day at a time
  if (Date.parse(range.from.toISOString()) === Date.parse(range.to.toISOString())) return (
    <Wrapper>
      <Button
        variant={"secondary"}
        className="shadow-lg w-full"
        type="button"
      >
        {format(range.from, FORMAT_DATE_STRING)}
      </Button>
    </Wrapper>
  )

  return (
    <Wrapper>
      <Button
        variant={"secondary"}
        className="shadow-lg w-full"
        type="button"
      >
        {format(range.from, FORMAT_DATE_STRING)} <MoveHorizontalIcon /> {format(range.to, FORMAT_DATE_STRING)}
      </Button>
    </Wrapper>
  )
}
