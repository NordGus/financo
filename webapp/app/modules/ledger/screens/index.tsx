import { format } from "date-fns";
import { CalendarIcon, ListFilterIcon, PlusIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "~/modules/shared/components/ui/button";

export function Screen() {
  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <ListFilterIcon />
          </Button>
          <Button
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <CalendarIcon /> {format(new Date(), "LLL d, yyyy")} to {format(new Date(), "LLL d, yyyy")}
          </Button>
          <Button
            size={"icon"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="overflow-x-hidden overflow-y-auto h-full p-4">
          <div className="flex flex-col gap-4">
            <span className="content-[''] h-9" />
          </div>
        </div>
      </div>
    </Fragment>
  )
}