import { X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useMemo } from "react";
import { Icon, ICONS } from "~/modules/shared/types/icon";
import { colorContrast } from "../../helpers/color-contrast";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FormControl } from "../ui/form";

type Entity = "category" | "account"

interface Props {
  value: Icon
  onChange: (value: Icon) => void
  entity?: Entity
  color?: string
}

function entityToHuman(entity: Entity): string {
  switch (entity) {
    case "category":
      return "Category"
    default:
      return "Account"
  }
}

export function IconInput({ value, onChange, entity = "account", color }: Props) {
  const selectables = useMemo(() => Object.values(ICONS), [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            size={"icon"}
            className="size-12 cursor-pointer"
            style={{
              backgroundColor: color ? colorContrast(color) : undefined,
              color: color ? colorContrast(colorContrast(color)) : undefined
            }}
          >
            <DynamicIcon name={value} className="size-6" />
          </Button>
        </FormControl>
      </DialogTrigger>
      <DialogContent className="overflow-clip">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>
            Please select an Icon to identify your {entityToHuman(entity)}
          </DialogDescription>
        </DialogHeader>
        <div
          className="grid grid-cols-8 justify-center items-center gap-2 max-h-[70dvh] p-4 overflow-y-auto no-scrollbar"
        >
          {selectables.map((icon) => (
            <DialogClose key={icon} asChild>
              <Button
                variant={value === icon ? "secondary" : "ghost"}
                className="size-12 justify-center items-center m-auto"
                size={"icon"}
                onClick={() => onChange(icon)}
                type="button"
              >
                <DynamicIcon name={icon} className="size-7" />
              </Button>
            </DialogClose>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} type="button">
              <X /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}