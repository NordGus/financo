import { useMemo, useState } from "react"
import { Throbber } from "~/modules/shared/components/throbber"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion"
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
import { Heading6 } from "~/modules/shared/components/ui/headings"
import { Kind } from "~/modules/shared/types/account"
import { Account } from "../../types/accounts"
import { AccountSelectOption } from "../account-select-option"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  selected: number[]
  onAdd: (id: number) => void
  onRemove: (id: number) => void
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

export function AccountPicker({ open, onOpenChange, accounts, submitting, ...props }: Props) {
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
          <Section accounts={capital} title="Capital" {...props} />
          <Section accounts={savings} title="Savings" {...props} />
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

interface SectionProps {
  accounts: Account[]
  selected: number[]
  onAdd: (id: number) => void
  onRemove: (id: number) => void
  title: string
}

function Section({ accounts, selected, title, onAdd, onRemove }: SectionProps) {
  if (accounts.length < 1) return null

  return (
    <div className="grid grid-cols-2 gap-2">
      <Heading6 className="col-span-2">{title}</Heading6>
      {accounts.map((account) => {
        const isSelected = selected.includes(account.id)

        return (
          <AccountSelectOption
            key={`account.filter.${account.id}`}
            name={account.name}
            icon={account.icon}
            color={account.color}
            selected={isSelected}
            onClick={isSelected ? () => onRemove(account.id) : () => onAdd(account.id)}
          />
        )
      })}
    </div>
  )
}

function AccordionSection({ accounts, selected, title, onAdd, onRemove }: SectionProps) {
  if (accounts.length < 1) return null

  const [open, setOpen] = useState(false)

  return (
    <Accordion type="single" value={open ? "opened" : "closed"}>
      <AccordionItem value="opened" className="grid grid-cols-1 gap-2">
        <AccordionTrigger onClick={() => setOpen(!open)}>
          <Heading6>{title}</Heading6>
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-2 gap-2">
          {accounts.map((account) => {
            const isSelected = selected.includes(account.id)

            return (
              <AccountSelectOption
                key={`account.filter.${account.id}`}
                name={account.name}
                icon={account.icon}
                color={account.color}
                selected={isSelected}
                onClick={isSelected ? () => onRemove(account.id) : () => onAdd(account.id)}
              />
            )
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}