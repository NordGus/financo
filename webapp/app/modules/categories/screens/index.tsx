import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/shared/components/ui/button";
import { Heading1 } from "~/shared/components/ui/headings";
import { isExpense, isIncome } from "~/shared/types/account";
import { Account } from "../type/preview";

interface Props {
  accounts: Account[]
}

type SubView = "active" | "archived"

function withSubView(view?: string | null): SubView {
  switch (view) {
    case "archived":
      return "archived"
    case "active":
    default:
      return "active"
  }
}

type View = "expense" | "income"

function withView(view?: string | null): View {
  switch (view) {
    case "income":
      return "income"
    case "expense":
    default:
      return "expense"
  }
}

export function Screen({ accounts }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = useMemo(() => withView(searchParams.get("view")), [searchParams.get("view")])
  const subView = useMemo(() => withSubView(searchParams.get("sub-view")), [searchParams.get("sub-view")])
  const isArchived = (archivedAt?: string | null) => subView === "active" ? !archivedAt : archivedAt
  const archived = (account: Account) => isArchived(account.archivedAt) ||
    account.children.filter((child) => isArchived(child.archivedAt)).length > 0
  const kinded = (account: Account) => {
    const filterFn = view === "income" ? isIncome : isExpense

    return filterFn(account.kind) || account.children.filter(({ kind }) => filterFn(kind)).length > 0
  }

  return (
    <div className="flex flex-col gap-4">
      <Heading1>Categories</Heading1>
      <div className="flex flex-row gap-4">
        <Button
          variant={view === "expense" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "expense")

            return prev
          })}
        >
          Expenses
        </Button>
        <Button
          variant={view === "income" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("view", "income")

            return prev
          })}
        >
          Income
        </Button>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          variant={subView === "active" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("sub-view", "active")

            return prev
          })}
        >
          Active
        </Button>
        <Button
          variant={subView === "archived" ? "secondary" : "outline"}
          onClick={() => setSearchParams((prev) => {
            prev.set("sub-view", "archived")

            return prev
          })}
        >
          Archived
        </Button>
      </div>
      <div className="flex gap-4 flex-row">
        {accounts.filter((a) => kinded(a)).filter((a) => archived(a)).map((account) => (
          <div key={`category:${account.id}`} className="flex flex-col gap-2">
            <span>{account.name}</span>
            <span>{account.kind}</span>
            <span>{account.archivedAt}</span>
            {account.children.filter((c) => isArchived(c.archivedAt)).map((child) => (
              <>
                <span>{account.name} ({child.name})</span>
                <span>{child.kind}</span>
                <span>{child.archivedAt}</span>
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}