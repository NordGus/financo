import { Icon } from "~/shared/types/icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl } from "../ui/form";
import { icons } from "../ui/icon";

interface Props {
  value: Icon
  onChange: (value: Icon) => void
}

export function IconInput({ value }: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={"w-full px-3 text-left font-normal"}
          >
            {icons[value]}
          </Button>
        </FormControl>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] overflow-clip">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        <span>{icons[value]}</span>
      </DialogContent>
    </Dialog>
  )
}