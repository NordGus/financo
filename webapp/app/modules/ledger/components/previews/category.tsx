import { ComponentProps } from "react"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { Account } from "../../types/accounts"

interface IncomeOrExpenseProps {
  account: Account
}

export function PreviewCategory({ account, onClick }: ComponentProps<"div"> & IncomeOrExpenseProps) {
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