import { InfoIcon } from "lucide-react";
import { Copy } from "~/shared/types/copy";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";

interface Props {
  copy: Copy,
  className?: string
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
}

export function InfoDialog({ copy: { title, message }, className, variant = "link", size = "icon" }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
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