import { use, useCallback, useMemo } from "react"
import { Button } from "~/modules/shared/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer"
import { Kind } from "~/modules/shared/types/account"
import { AccountsContext } from "../../contexts/accounts-context"
import { OnSourceChangeCallback, useCreationStore } from "../../stores/creation"
import { Account } from "../../types/accounts"
import { PreviewAccount } from "../previews/account"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelected?: OnSourceChangeCallback
}

export function TransactionSourcePicker({ open, onOpenChange, onSelected }: Props) {
  const { kind, target } = useCreationStore(state => state)
  const onSourceChange = useCreationStore(state => state.onSourceChange)

  const { accounts } = use(AccountsContext)

  const selectableAccounts = useMemo<Account[]>(() => {
    return Array.from(accounts.values())
      .filter(({ parentId }) => !parentId)
      .filter(({ archivedAt }) => !archivedAt)
      .filter(({ id }) => id !== target)
  }, [accounts, target])

  const accountsFor = useCallback((kind: Kind): Account[] => {
    return selectableAccounts.filter(({ kind: k }) => kind === k)
  }, [selectableAccounts])

  const capital = useMemo(() => accountsFor("capital"), [accountsFor])
  const savings = useMemo(() => accountsFor("savings"), [accountsFor])
  const debt = useMemo(() => accountsFor("debt"), [accountsFor])
  const credit = useMemo(() => accountsFor("credit"), [accountsFor])

  const onClick = (id: number) => onSourceChange(id, onSelected)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="grid grid-rows-[auto_auto_60dvh_auto]">
        <DrawerHeader>
          <DrawerTitle>
            {
              kind === "income"
                ? "To Account"
                : "From Account"
            }
          </DrawerTitle>
          <DrawerDescription>
            {
              kind === "income"
                ? "Select the Transaction's target Account"
                : "Select the Transaction's source Account"
            }
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4">
          <div className="flex-grow overflow-y-auto">
            {
              capital.length > 0 && (
                <>
                  <p className="text-xl mb-2">Capital</p>
                  {
                    capital.map((account) => (
                      <PreviewAccount
                        key={`target.account.transfer.${account.id}`}
                        account={account}
                        onClick={() => onClick(account.id)}
                      />
                    ))
                  }
                </>
              )
            }
            {
              savings.length > 0 && (
                <>
                  <p className="text-xl mb-2">Savings</p>
                  {
                    savings.map((account) => (
                      <PreviewAccount
                        key={`target.account.transfer.${account.id}`}
                        account={account}
                        onClick={() => onClick(account.id)}
                      />
                    ))
                  }
                </>
              )
            }
            {
              debt.length > 0 && (
                <>
                  <p className="text-xl mb-2">Debts</p>
                  {
                    debt.map((account) => (
                      <PreviewAccount
                        key={`target.account.transfer.${account.id}`}
                        account={account}
                        onClick={() => onClick(account.id)}
                      />
                    ))
                  }
                </>
              )
            }
            {
              credit.length > 0 && (
                <>
                  <p className="text-xl mb-2">Credit</p>
                  {
                    credit.map((account) => (
                      <PreviewAccount
                        key={`target.account.transfer.${account.id}`}
                        account={account}
                        onClick={() => onClick(account.id)}
                      />
                    ))
                  }
                </>
              )
            }
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"outline"}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  )
}
