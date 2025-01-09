import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/components/ui/select";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings } from "~/shared/types/account";
import { ListForKind } from "../components/list-for-kind";
import { accountKindsManual } from "../manual/account-kinds-manual";
import { archivedAccountsManual } from "../manual/archived-accounts-manual";
import { Account } from "../types/preview";

interface Props {
  accounts: Account[]
}

type View = "active" | "archived"

function withView(view?: string | null): View {
  switch (view) {
    case "archived":
      return "archived"
    case "active":
    default:
      return "active"
  }
}

export function Screen({ accounts }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(withView(searchParams.get("view")))

  const archived = (archivedAt?: string | null) => view === "active" ? !archivedAt : archivedAt;

  useEffect(() => setSearchParams({ view: view }), [view])

  return (
    <div className="flex flex-col gap-4">
      <Heading1>Accounts</Heading1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Select value={view} onValueChange={(value) => setView(withView(value))}>
          <SelectTrigger>
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {view === "archived" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <InfoDialog
            copy={archivedAccountsManual}
            withTitleInButton
            variant={"outline"}
            size={"default"}
            className="flex items-center justify-start"
          />
        </div>
      )}
      <Heading2 className="flex gap-4 items-center">
        Capital <InfoDialog copy={accountKindsManual.capital} />
      </Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && archived(archivedAt))}
        forKind="capital_normal"
        forArchived={view === "archived"}
      />
      <Heading2 className="flex gap-4 items-center">
        Savings <InfoDialog copy={accountKindsManual.savings} />
      </Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && archived(archivedAt))}
        forKind="capital_savings"
        forArchived={view === "archived"}
      />
      <Heading2 className="flex gap-4 items-center">
        Loans <InfoDialog copy={accountKindsManual.loans} />
      </Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && archived(archivedAt))}
        forKind="debt_loan"
        forArchived={view === "archived"}
      />
      <Heading2 className="flex gap-4 items-center">
        Personal debts <InfoDialog copy={accountKindsManual.personalDebt} />
      </Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && archived(archivedAt))}
        forKind="debt_personal"
        forArchived={view === "archived"}
      />
      <Heading2 className="flex gap-4 items-center">
        Credit <InfoDialog copy={accountKindsManual.credit} />
      </Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && archived(archivedAt))}
        forKind="debt_credit"
        forArchived={view === "archived"}
      />
    </div>
  )
}