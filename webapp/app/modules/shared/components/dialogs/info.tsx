import { InfoIcon, X } from "lucide-react";
import { ComponentProps, useState } from "react";
import { Copy } from "~/modules/shared/types/copy";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

interface Props extends ComponentProps<typeof Button> {
  copy: Copy,
  className?: string
  withTitleInButton?: boolean
}

export function InfoDialog({ copy, className, variant = "link", size = "icon", withTitleInButton = false }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)} type="button">
        <InfoIcon /> {withTitleInButton && <span>{copy.title}</span>}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2" asChild>
            <div>
              {copy.message}
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button asChild variant={"outline"}>
              <DialogClose>
                <X /> Close
              </DialogClose>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}