import { useMemo } from "react";
import { Icon, ICONS } from "~/shared/types/icon";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer";
import { FormControl } from "../ui/form";
import { icons } from "../ui/icon";

type Entity = "category" | "account"

interface Props {
  value: Icon
  onChange: (value: Icon) => void
  entity?: Entity
}

function entityToHuman(entity: Entity): string {
  switch (entity) {
    case "category":
      return "Category"
    default:
      return "Account"
  }
}

export function IconInput({ value,
  onChange, entity = "account" }: Props) {
  const selectables = useMemo(() => Object.values(ICONS), [])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={"w-full px-3 text-left font-normal"}
          >
            {icons[value]}
          </Button>
        </FormControl>
      </DrawerTrigger>
      <DrawerContent className="overflow-clip">
        <DrawerHeader>
          <DrawerTitle>Select an Icon</DrawerTitle>
          <DrawerDescription>
            Please select an Icon to identify your {entityToHuman(entity)}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-6 justify-center items-center gap-2 max-h-[70dvh] p-4 overflow-y-auto">
          {selectables.map((icon) => (
            <DrawerClose key={icon} asChild>
              <Button
                variant={value === icon ? "secondary" : "ghost"}
                className="[&_svg]:size-8 h-fit w-fit p-2"
                size={"icon"}
                onClick={() => onChange(icon)}
                type="button"
              >
                {icons[icon]}
              </Button>
            </DrawerClose>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant={"outline"}
              type="button"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}