import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/shared/components/ui/accordion";
import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings } from "~/shared/types/account";
import { ListForKind } from "../components/preview/list-for-kind";
import { Account } from "../types/preview";

interface Props {
  accounts: Account[]
}

export function Screen({ accounts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Heading1>accounts</Heading1>
      <Heading2>capital</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && !archivedAt)}
        forKind="capital_normal"
      />
      <Heading2>savings</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && !archivedAt)}
        forKind="capital_savings"
      />
      <Heading2>loans</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && !archivedAt)}
        forKind="debt_loan"
      />
      <Heading2>personal debts</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && !archivedAt)}
        forKind="debt_personal"
      />
      <Heading2>credit</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && !archivedAt)}
        forKind="debt_credit"
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="archive">
          <AccordionTrigger className="justify-start gap-4 hover:no-underline">
            <Heading1>archived accounts</Heading1>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <Heading2>capital</Heading2>
            <ListForKind
              accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && archivedAt)}
              forKind="capital_normal"
              forArchived
            />
            <Heading2>savings</Heading2>
            <ListForKind
              accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && archivedAt)}
              forKind="capital_savings"
              forArchived
            />
            <Heading2>loans</Heading2>
            <ListForKind
              accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && archivedAt)}
              forKind="debt_loan"
              forArchived
            />
            <Heading2>personal debts</Heading2>
            <ListForKind
              accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && archivedAt)}
              forKind="debt_personal"
              forArchived
            />
            <Heading2>credit</Heading2>
            <ListForKind
              accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && archivedAt)}
              forKind="debt_credit"
              forArchived
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}