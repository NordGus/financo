import { ComponentProps } from "react";
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human";
import { NewForKindLink } from "./links/new-for-kind";

export function NoAccountsForKind({ kind, ...props }: ComponentProps<typeof NewForKindLink>) {
  return (
    <div className="space-y-2">
      <p className="text-lg">
        {`You have not registered any ${accountKindToHuman(kind)} Accounts.`}
      </p>
      <NewForKindLink kind={kind} {...props} />
    </div>
  )
}