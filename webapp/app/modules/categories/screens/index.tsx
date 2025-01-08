import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { InfoAlert } from "~/shared/components/alerts/info";
import { Heading1 } from "~/shared/components/ui/headings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shared/components/ui/select";
import { isExpense, isIncome, KINDS } from "~/shared/types/account";
import { ListForKind } from "../components/list-for-kind";
import { archivedCategoriesManual } from "../manual/archived-categories-manual";
import { Account } from "../types/preview";

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
  const [view, setView] = useState<View>(withView(searchParams.get("view")))
  const [subView, setSubView] = useState<SubView>(withSubView(searchParams.get("sub-view")))

  const archived = (account: Account) => {
    const filterFn = (archivedAt?: string | null) => subView === "active" ? !archivedAt : !!archivedAt

    return filterFn(account.archivedAt) || account.children.filter((child) => filterFn(child.archivedAt)).length > 0
  }
  const kinded = (account: Account) => {
    const filterFn = view === "income" ? isIncome : isExpense

    return filterFn(account.kind) || account.children.filter(({ kind }) => filterFn(kind)).length > 0
  }

  useEffect(() => setSearchParams({ view: view, ["sub-view"]: subView }), [view, subView])

  return (
    <div className="flex flex-col gap-4">
      <Heading1>Categories</Heading1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Select value={view} onValueChange={(value) => setView(withView(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
        <Select value={subView} onValueChange={(value) => setSubView(withSubView(value))}>
          <SelectTrigger>
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {subView === "archived" && <InfoAlert copy={archivedCategoriesManual} />}
      <ListForKind
        accounts={accounts.filter((a) => kinded(a)).filter((a) => archived(a))}
        kind={view === "income" ? KINDS["external_income"] : KINDS["external_expense"]}
        archived={subView === "archived"}
      />
    </div >
  )
}