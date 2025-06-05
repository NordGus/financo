import { InfoIcon, X } from "lucide-react";
import { ComponentProps, PropsWithChildren } from "react";
import { Copy } from "~/modules/shared/types/copy";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

interface Props extends ComponentProps<typeof Button> {
  copy: Copy,
  className?: string
  withTitleInButton?: boolean
}

export function InfoDialog({
  copy,
  className,
  variant = "link",
  size = "icon",
  withTitleInButton = false,
  children
}: PropsWithChildren<Props>) {
  return (
    <Dialog>
      {
        children
          ? (
            <DialogTrigger asChild>
              {children}
            </DialogTrigger>
          )
          : (
            <Button variant={variant} size={size} className={className} asChild>
              <DialogTrigger>
                <InfoIcon /> {withTitleInButton && <span>{copy.title}</span>}
              </DialogTrigger>
            </Button>
          )
      }
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
  )
}