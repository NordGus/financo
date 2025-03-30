import { ListFilterIcon } from "lucide-react"
import { useMemo, useState } from "react"
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
import { useAccounts } from "../../hooks/use-accounts"
import { Account } from "../../types/accounts"
import { AccordionSection, Section } from "../picker-section"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  selected: number[]
  onChangePick: (ids: number[]) => void
  submitting: boolean
}

function isCategory(kind: Kind): boolean {
  switch (kind) {
    case "income":
    case "expense":
    case "credit":
    case "debt":
      return true
    default:
      return false
  }
}

export function CategoryPicker({ open, onOpenChange, onChangePick, selected, submitting }: Props) {
  const [ids, setIds] = useState(selected)

  const accounts = useAccounts()

  const onAdd = (id: number) => !ids.includes(id) && setIds([...ids, id])
  const onRemove = (id: number) => setIds(ids.filter((prev) => prev !== id))

  const expenses = useMemo(
    () => accounts.filter(({ kind, parentId, archivedAt }) => kind === "expense" && !archivedAt && !parentId),
    [accounts]
  )
  const income = useMemo(
    () => accounts.filter(({ kind, parentId, archivedAt }) => kind === "income" && !archivedAt && !parentId),
    [accounts]
  )
  const loans = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "debt" && !archivedAt),
    [accounts]
  )
  const credit = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "credit" && !archivedAt),
    [accounts]
  )
  const archived = useMemo(
    () => accounts.filter(({ kind, parentId, archivedAt }) => isCategory(kind) && !!archivedAt && !parentId),
    [accounts]
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Categories</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            {"Select which Categories you to filter the ledger's transaction"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 max-h-[80dvh] overflow-y-auto">
          <Section accounts={expenses} title="Expenses" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={income} title="Income" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={loans} title="Debts" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={credit} title="Credit" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <AccordionSection accounts={archived} title="Archived" selected={ids} onAdd={onAdd} onRemove={onRemove} />
        </div>
        <DrawerFooter className="grid grid-cols-2">
          <DrawerClose asChild>
            <Button
              variant={"outline"}
              disabled={submitting}
              onClick={() => {
                setIds([])
                onChangePick([])
              }}
            >
              Reset
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              disabled={submitting}
              onClick={() => onChangePick(ids)}
            >
              <ListFilterIcon /> Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}