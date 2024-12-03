import { useMemo } from "react";
import { Icon, ICONS } from "~/shared/types/icon";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl } from "../ui/form";
import { icons } from "../ui/icon";

interface Props {
  value: Icon
  onChange: (value: Icon) => void
}

export function IconInput({ value, onChange }: Props) {
  const selectables = useMemo(() => Object.values(ICONS), [])

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
        <div className="flex flex-row flex-wrap justify-center gap-2 max-h-[70dvh] overflow-y-auto">
          {selectables.map((icon) => (
            <DialogClose key={icon} asChild>
              <Button
                variant={value === icon ? "default" : "outline"}
                className="[&_svg]:size-8 h-fit w-fit p-2"
                size={"icon"}
                onClick={() => onChange(icon)}
              >
                {icons[icon]}
              </Button>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}