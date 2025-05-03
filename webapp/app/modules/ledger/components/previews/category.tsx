import { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { Account } from "../../types/accounts"
import { SelectedAccountBadge } from "../badges/selected-account"

interface Props {
  account: Account
  parent?: Account
  selected: boolean
}

export function PreviewCategory({ account, parent, selected, className, ...props }: ComponentProps<"div"> & Props) {
  return (
    <div
      className={cn("flex flex-col justify-center items-center gap-2 cursor-pointer", className)}
      {...props}
    >
      <div className="inline-block relative">
        <AccountListingIcon
          kind={account.kind}
          icon={account.icon}
          color={account.color}
          main={account.main}
        />
        {selected && <SelectedAccountBadge className="translate-x-2/4 translate-y-3/4" />}
      </div>
      {
        parent
          ? <p className="text-xs text-center">{parent.name} ({account.name})</p>
          : <p className="text-xs text-center">{account.name}</p>
      }
    </div>
  )
}