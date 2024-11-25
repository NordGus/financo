import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { isCapital, isCredit, isDebt, isSavings, Kind } from "~/shared/types/account";
import { ListForKind } from "../components/preview/list-for-kind";
import { Account } from "../types/preview";

interface Props {
  accounts: Account[]
  onNew: (kind: Kind) => void
}

export function Screen({ accounts, onNew }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Heading1>accounts</Heading1>
      <Heading2>capital</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind }) => isCapital(kind))}
        forKind="capital_normal"
        onNew={onNew}
      />
      <Heading2>savings</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind }) => isSavings(kind))}
        forKind="capital_savings"
        onNew={onNew}
      />
      <Heading2>debts</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind }) => isDebt(kind))}
        forKind="debt_loan"
        onNew={onNew}
      />
      <Heading2>credit</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind }) => isCredit(kind))}
        forKind="debt_credit"
        onNew={onNew}
      />
    </div>
  )
}