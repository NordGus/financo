import { ListFilterIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer";
import { Kind } from "~/modules/shared/types/account";
import { Account } from "../../types/accounts";
import { AccordionSection, Section } from "../picker-section";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  selected: number[]
  onChangePick: (ids: number[]) => void
  submitting: boolean
}

function isAccount(kind: Kind): boolean {
  switch (kind) {
    case "capital_normal":
    case "capital_savings":
    case "debt_loan":
    case "debt_personal":
    case "debt_credit":
      return true
    default:
      return false
  }
}

export function AccountPicker({ open, onOpenChange, onChangePick, accounts, selected, submitting }: Props) {
  const [ids, setIds] = useState(selected)
  const onAdd = (id: number) => !ids.includes(id) && setIds([...ids, id])
  const onRemove = (id: number) => setIds(ids.filter((prev) => prev !== id))

  const capital = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "capital_normal" && !archivedAt),
    [accounts]
  )
  const savings = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "capital_savings" && !archivedAt),
    [accounts]
  )
  const loans = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "debt_loan" && !archivedAt),
    [accounts]
  )
  const personal = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "debt_personal" && !archivedAt),
    [accounts]
  )
  const credit = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => kind === "debt_credit" && !archivedAt),
    [accounts]
  )
  const archived = useMemo(
    () => accounts.filter(({ kind, archivedAt }) => isAccount(kind) && !!archivedAt),
    [accounts]
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Accounts</DrawerTitle>
          <DrawerDescription className="hidden" data-hidden>
            {"Select which Accounts you to filter the ledger's transaction"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 max-h-[80dvh] overflow-y-auto">
          <Section accounts={capital} title="Capital" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={savings} title="Savings" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={loans} title="Loans" selected={ids} onAdd={onAdd} onRemove={onRemove} />
          <Section accounts={personal} title="Personal debt" selected={ids} onAdd={onAdd} onRemove={onRemove} />
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
