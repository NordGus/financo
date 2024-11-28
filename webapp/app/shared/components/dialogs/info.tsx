import { InfoIcon } from "lucide-react";
import { Copy } from "~/shared/types/copy";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";

interface Props {
  copy: Copy
}

export function InfoDialog({ copy: { title, message } }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="icon">
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="space-y-2">
          {message}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}