import { CheckIcon, ChevronsUpDownIcon, View as SubView } from "lucide-react"
import { useState } from "react"
import { Button } from "~/shared/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer"

type SubView = "active" | "archived"

const viewToHuman: Record<SubView, string> = {
  active: "Active",
  archived: "Archived"
}

interface Props {
  value: SubView
  onValueChange: (view: SubView) => void
}

export function SelectIndexScreenSubView({ value, onValueChange }: Props) {
  const [open, setOpen] = useState(false)
  const views: SubView[] = ["active", "archived"]

  return (
    <>
      <Button
        variant={"outline"}
        className="justify-between shadow-lg"
        onClick={() => setOpen(true)}
      >
        <span>View: {viewToHuman[value]}</span> <ChevronsUpDownIcon />
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