import { ComponentProps, use, useMemo, useState } from "react"
import { cn } from "~/lib/utils"
import { AccountListingIcon } from "~/modules/shared/components/icons/account-icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/modules/shared/components/ui/dialog"
import { colorContrast } from "~/modules/shared/helpers/color-contrast"
import { AccountsContext } from "../../contexts/accounts-context"
import { Account } from "../../types/accounts"
import { Kind } from "../../types/transactions"
import { TransactionSourcePicker } from "../transaction-source-picker"
import { TransactionTargetPicker } from "../transaction-target-picker"

type Props = {
  id: number
  kind: Kind
  targetId: number
  onChange: (kind: Kind, id: number) => void
  disabled?: boolean
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

export function TransactionSource({ id, kind, onChange, targetId, disabled }: Props) {
  const [open, setOpen] = useState(false)

  const { accountsMap } = use(AccountsContext)

  const account = useMemo(() => accountsMap.get(id)!, [id])
  const parent = useMemo(() => accountsMap.get(account.parentId ?? -1), [account.parentId])

  return (
    <>
      <AccountPreview
        account={account}
        parent={parent}
        kind="source"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {"Select a Source Account"}
            </DialogTitle>
            <DialogDescription>
              {"Select a Source Account for this Transaction"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[50dvh] overflow-hidden">
            {
              kind === "income"
                ? (
                  <TransactionTargetPicker
                    selected={id}
                    onSelected={(newKind, id) => {
                      setOpen(false)
                      onChange(newKind, id)
                    }}
                    kind={kind}
                  />
                )
                : (
                  <TransactionSourcePicker
                    selected={id}
                    target={targetId}
                    onSelected={(id) => {
                      setOpen(false)
                      onChange(kind, id)
                    }}
                  />
                )
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function TransactionTarget({ id, kind, onChange, targetId, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const { accountsMap } = use(AccountsContext)

  const account = useMemo(() => accountsMap.get(id)!, [id])
  const parent = useMemo(() => accountsMap.get(account.parentId ?? -1), [account.parentId])

  return (
    <>
      <AccountPreview
        account={account}
        parent={parent}
        kind="target"
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {"Select a Target Account"}
            </DialogTitle>
            <DialogDescription>
              {"Select a Target Account for this Transaction"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col h-[50dvh] overflow-hidden">
            {
              kind === "income"
                ? (
                  <TransactionSourcePicker
                    selected={id}
                    target={targetId}
                    onSelected={(id) => {
                      setOpen(false)
                      onChange(kind, id)
                    }}
                  />
                )
                : (
                  <TransactionTargetPicker
                    selected={id}
                    onSelected={(newKind, id) => {
                      setOpen(false)
                      onChange(newKind, id)
                    }}
                    kind={kind}
                  />
                )
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface AccountPreviewProps extends ComponentProps<"div"> {
  account: Account
  parent: Account | undefined
  kind: "source" | "target"
  disabled?: boolean
}

function AccountPreview({ account, parent, kind, disabled = false, ...props }: AccountPreviewProps) {
  const contrast = colorContrast(account.color)

  return (
    <div
      {...props}
      className={cn(
        "rounded-lg p-3 flex flex-col gap-2 cursor-pointer",
        disabled && "cursor-not-allowed"
      )}
      style={{
        backgroundColor: account.color,
        color: contrast
      }}
    >
      <span className="text-xs opacity-50">
        {kind === "source" ? "From" : "To"} {label(account)}
      </span>
      <div className="flex items-center">
        <AccountListingIcon
          kind={account.kind}
          icon={account.icon}
          color={colorContrast(contrast)}
          main={account.main}
          className="p-2 inline-flex mr-3"
        />
        {accountName(account, parent)}
      </div>
    </div>
  )
}