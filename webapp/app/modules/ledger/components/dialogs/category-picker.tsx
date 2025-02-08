import { useMemo } from "react"
import { Throbber } from "~/modules/shared/components/throbber"
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
import { Account } from "../../types/accounts"
import { AccordionSection, Section } from "../picker-section"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  selected: number[]
  onAdd: (id: number) => void
  onRemove: (id: number) => void
  submitting: boolean
}

function isCategory(kind: Kind): boolean {
  switch (kind) {
    case "external_income":
    case "external_expense":
    case "debt_credit":
    case "debt_loan":
    case "debt_personal":
      return true
    default:
      return false
  }
}

export function CategoryPicker({ open, onOpenChange, accounts, submitting, ...props }: Props) {
  const expenses = useMemo(
    () => accounts.filter(({ kind, parentId, archivedAt }) => kind === "external_expense" && !archivedAt && !parentId),
    [accounts]
  )
  const income = useMemo(
    () => accounts.filter(({ kind, parentId, archivedAt }) => kind === "external_income" && !archivedAt && !parentId),
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
          <Section accounts={expenses} title="Expenses" {...props} />
          <Section accounts={income} title="Income" {...props} />
          <Section accounts={loans} title="Loans" {...props} />
          <Section accounts={personal} title="Personal debt" {...props} />
          <Section accounts={credit} title="Credit" {...props} />
          <AccordionSection accounts={archived} title="Archived" {...props} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"outline"} disabled={submitting}>
              {submitting ? <Throbber size={"sm"} /> : "Cancel"}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}