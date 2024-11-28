import { InfoIcon } from "lucide-react";
import { Copy } from "~/shared/types/copy";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  copy: Copy
}

export function InfoAlert({ copy: { title, message } }: Props) {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>
        {title}
      </AlertTitle>
      <AlertDescription className="space-y-1">
        {message}
      </AlertDescription>
    </Alert>
  )
}