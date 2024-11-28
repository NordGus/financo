import { InfoIcon } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/shared/components/ui/alert";
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
      <Heading1>Accounts</Heading1>
      <div className="flex flex-row gap-4">
        <Button
          variant={view === "active" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "active")

            return prev
          })}
        >
          Active
        </Button>
        <Button
          variant={view === "archived" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "archived")

            return prev
          })}
        >
          Archived
        </Button>
      </div>
      {
        view === "archived" && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>
              What means that an Account is archived?
            </AlertTitle>
            <AlertDescription>
              <p>When an Account is archived it means you are no longer using it, it can be because you close it, payed it or it was paid. So they simply stop appearing anywhere else inside <span className="font-bold">financo</span> like what happens with deletion.</p>
              <p>But contrary to deletion, you do not lose your Transaction history when you archive any Account, ergo archival only helps to clean the noise within your <span className="font-bold">financo</span> experience.</p>
            </AlertDescription>
          </Alert>
        )
      }
      <Heading2>Capital</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCapital(kind) && archived(archivedAt))}
        forKind="capital_normal"
        forArchived={view === "archived"}
      />
      <Heading2>Savings</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isSavings(kind) && archived(archivedAt))}
        forKind="capital_savings"
        forArchived={view === "archived"}
      />
      <Heading2>Loans</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isLoan(kind) && archived(archivedAt))}
        forKind="debt_loan"
        forArchived={view === "archived"}
      />
      <Heading2>Personal debts</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isPersonalDebt(kind) && archived(archivedAt))}
        forKind="debt_personal"
        forArchived={view === "archived"}
      />
      <Heading2>Credit</Heading2>
      <ListForKind
        accounts={accounts.filter(({ kind, archivedAt }) => isCredit(kind) && archived(archivedAt))}
        forKind="debt_credit"
        forArchived={view === "archived"}
      />
    </div>
  )
}