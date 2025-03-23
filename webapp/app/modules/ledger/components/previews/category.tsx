import { ComponentProps } from "react"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { Account } from "../../types/accounts"

interface Props {
  account: Account
}

export function PreviewCategory({ account, onClick }: ComponentProps<"div"> & Props) {
  return (
    <div onClick={onClick} className="flex flex-col justify-center items-center gap-2 cursor-pointer">
      <AccountListingIcon
        kind={account.kind}
        icon={account.icon}
        color={account.color}
        main={account.main}
      />
      <p className="text-xs text-center">{account.name}</p>
    </div>
  )
}