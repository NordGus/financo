import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/shared/components/ui/button";
import { Heading1, Heading2 } from "~/shared/components/ui/headings";
import { isCapital, isCredit, isLoan, isPersonalDebt, isSavings } from "~/shared/types/account";
import { ListForKind } from "../components/list-for-kind";
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
  const view = useMemo(() => withView(searchParams.get("view")), [searchParams.get("view")]);
  const archived = (archivedAt?: string | null) => view === "active" ? !archivedAt : archivedAt;

  return (
    <div className="flex flex-col gap-4">
      <Heading1>accounts</Heading1>
      <div className="flex flex-row gap-4">
        <Button
          variant={view === "active" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "active")

            return prev
          })}
        >
          active
        </Button>
        <Button
          variant={view === "archived" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "archived")

            return prev
          })}
        >
          archived
        </Button>
      </div>
      <Heading2>capital</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && archived(archivedAt))}
        forKind="capital_normal"
        forArchived={view === "archived"}
      />
      <Heading2>savings</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && archived(archivedAt))}
        forKind="capital_savings"
        forArchived={view === "archived"}
      />
      <Heading2>loans</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && archived(archivedAt))}
        forKind="debt_loan"
        forArchived={view === "archived"}
      />
      <Heading2>personal debts</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && archived(archivedAt))}
        forKind="debt_personal"
        forArchived={view === "archived"}
      />
      <Heading2>credit</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && archived(archivedAt))}
        forKind="debt_credit"
        forArchived={view === "archived"}
      />
    </div>
  )
}