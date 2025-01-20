import { CheckIcon, ChevronsUpDownIcon, View } from "lucide-react"
import { useState } from "react"
import { Button } from "~/shared/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer"

type View = "active" | "archived"

const viewToHuman: Record<View, string> = {
  active: "Active",
  archived: "Archived"
}

interface Props {
  value: View
  onValueChange: (view: View) => void
}

export function SelectIndexScreenView({ value, onValueChange }: Props) {
  const [open, setOpen] = useState(false)
  const views: View[] = ["active", "archived"]

  return (
    <>
      <Button
        variant={"outline"}
        className="justify-between"
        onClick={() => setOpen(true)}
      >
        {viewToHuman[value]} <ChevronsUpDownIcon />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="hidden">
            <DrawerTitle>Select view</DrawerTitle>
            <DrawerDescription>
              Which view you want to access?
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
            {
              views.map((view) => (
                <Button
                  key={`view.${view}`}
                  variant={"secondary"}
                  className="justify-between"
                  onClick={() => {
                    onValueChange(view)
                    setOpen(false)
                  }}
                >
                  {viewToHuman[view]} {view === value && <CheckIcon />}
                </Button>
              ))
            }
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}