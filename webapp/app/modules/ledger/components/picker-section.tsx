import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion"
import { Heading6 } from "~/modules/shared/components/ui/headings"
import { Account } from "../types/accounts"
import { AccountSelectOption } from "./account-select-option"

interface Props {
  accounts: Account[]
  selected: number[]
  onAdd: (id: number) => void
  onRemove: (id: number) => void
  title: string
}

export function Section({ accounts, selected, title, onAdd, onRemove }: Props) {
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
            asCategory={account.kind === "expense" || account.kind === "income"}
          />
        )
      })}
    </div>
  )
}

export function AccordionSection({ accounts, selected, title, onAdd, onRemove }: Props) {
  if (accounts.length < 1) return null

  const [open, setOpen] = useState(accounts.some(({ id }) => selected.includes(id)))

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
                asCategory={account.kind === "expense" || account.kind === "income"}
              />
            )
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}