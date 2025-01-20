import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { Copy } from "~/shared/types/copy";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "../ui/drawer";

interface Props {
  copy: Copy,
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
  withTitleInButton?: boolean
}

export function InfoDialog({ copy, className, variant = "link", size = "icon", withTitleInButton = false }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)} type="button">
        <InfoIcon /> {withTitleInButton && <span>{copy.title}</span>}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="min-h-[50dvh]">
          <DrawerHeader>
            <DrawerTitle>{copy.title}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="space-y-2 px-4 pb-4">
            {copy.message}
          </DrawerDescription>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant={"outline"}>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer >
    </>
  )
}