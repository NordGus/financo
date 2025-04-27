import { use, useMemo } from "react"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import { colorContrast } from "~/modules/shared/helpers/color-contrast"
import { AccountsContext } from "../../contexts/accounts-context"
import { Account } from "../../types/accounts"

type Props = {
  id: number
  onChange: (id: number) => void
}

function label({ kind }: Account): string {
  switch (kind) {
    case "income":
    case "expense":
      return "Category"
    default:
      return "Account"
  }
}

function accountName(account: Account, parent: Account | undefined): string {
  if (!parent) return account.name

  return `${parent.name} (${account.name})`
}

export function TransactionSource({ id }: Props) {
  const { accountsMap } = use(AccountsContext)

  const account = useMemo(() => accountsMap.get(id)!, [id])
  const parent = useMemo(() => accountsMap.get(account.parentId ?? -1), [account.parentId])

  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-2 cursor-pointer"
      style={{
        backgroundColor: account.color,
        color: colorContrast(account.color)
      }}
    >
      <span className="text-xs opacity-50">
        From {label(account)}
      </span>
      <span className="flex items-center">
        <AccountListingIcon
          kind={account.kind}
          icon={account.icon}
          color={colorContrast(account.color)}
          main={account.main}
          className="p-2 inline-flex mr-3"
        />
        {accountName(account, parent)}
      </span>
      <span className="block text-xs opacity-75">
        {account.description}
      </span>
    </div>
  )
}

export function TransactionTarget({ id }: Props) {
  const { accountsMap } = use(AccountsContext)

  const account = useMemo(() => accountsMap.get(id)!, [id])
  const parent = useMemo(() => accountsMap.get(account.parentId ?? -1), [account.parentId])

  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-2 cursor-pointer"
      style={{
        backgroundColor: account.color,
        color: colorContrast(account.color)
      }}
    >
      <span className="text-xs opacity-50">
        To {label(account)}
      </span>
      <div className="flex items-center">
        <AccountListingIcon
          kind={account.kind}
          icon={account.icon}
          color={colorContrast(account.color)}
          main={account.main}
          className="p-2 inline-flex mr-3"
        />
        {accountName(account, parent)}
      </div>
    </div>
  )
}