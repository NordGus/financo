import { Info } from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "~/modules/shared/components/ui/alert";
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human";
import { NewForKindLink } from "./links/new-for-kind";

type Props = {
  archived: boolean | undefined
}

export function NoAccountsForKind({
  kind,
  className,
  archived = false,
  ...props
}: ComponentProps<typeof NewForKindLink> & Props) {
  return (
    <Alert>
      <Info />
      <AlertTitle>
        {`No ${accountKindToHuman(kind)} Accounts found`}
      </AlertTitle>
      <AlertDescription>
        <span>
          {`Looks like you don't have register any ${accountKindToHuman(kind)} Accounts matching these filters.`}
        </span>
        {
          !archived && (
            <NewForKindLink
              kind={kind}
              size={"sm"}
              variant={"outline"}
              className={cn("mt-4", className)}
              {...props}
            />
          )
        }
      </AlertDescription>
    </Alert>
  )
}