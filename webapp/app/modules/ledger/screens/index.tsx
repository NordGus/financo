import { format } from "date-fns";
import { CalendarIcon, ListFilterIcon, MoveHorizontalIcon, PlusIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "~/modules/shared/components/ui/button";

export function Screen() {
  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 right-0 p-4 flex gap-4 justify-stretch w-full">
          <Button
            variant={"secondary"}
            className="shadow-lg w-full"
          >
            {format(new Date(), "LLL do, yyyy")} <MoveHorizontalIcon /> {format(new Date(), "LLL do, yyyy")}
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <CalendarIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <ListFilterIcon />
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
          <span className="content-[''] h-9 block my-2" />
          <div className="flex flex-col gap-4">
          </div>
          <span className="content-[''] h-9 block my-2" />
        </div>
      </div>
    </Fragment>
  )
}