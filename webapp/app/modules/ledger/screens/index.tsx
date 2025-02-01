import { format } from "date-fns";
import { CalendarIcon, ListFilterIcon, MoveHorizontalIcon, PlusIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "~/modules/shared/components/ui/button";
import { DateGroup } from "../components/date-group";
import { Entry } from "../components/entry";
import { Account } from "../types/accounts";
import { SearchAction, Transactions } from "../types/transactions";

interface Props {
  transactions: Transactions
  accounts: Map<number, Account>
  searchParams: URLSearchParams
  onSearchParamsChange: (nextInit: Record<string, string | string[]>) => void
  onSearchActions: SearchAction
}

export function Screen({
  transactions,
  accounts,
}: Props) {

  return (
    <Fragment>
      <div className="relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 right-0 p-4 flex gap-4 justify-stretch w-full">
          <Button
            variant={"secondary"}
            className="shadow-lg w-full"
          >
            {format(new Date(), "LLL do, yyyy")} <MoveHorizontalIcon /> {format(new Date(), "LLL do, yyyy")}
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 p-4 inline-flex gap-4 flex-wrap justify-end">
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <CalendarIcon />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <ListFilterIcon />
          </Button>
          <Button
            size={"icon"}
            className="shadow-lg"
            onClick={() => { }}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="overflow-x-hidden overflow-y-auto h-full p-4">
          <span className="content-[''] h-9 block my-2" />
          <div className="flex flex-col gap-2">
            {
              transactions.map(([date, entries]) => (
                <DateGroup key={date} date={date}>
                  {entries.map((transaction) => {
                    const source = accounts.get(transaction.sourceId)!
                    const sourceParent = source.parentId === null ? null : accounts.get(source.parentId)!
                    const target = accounts.get(transaction.targetId)!
                    const targetParent = target.parentId === null ? null : accounts.get(target.parentId)!

                    return (
                      <Entry
                        key={`${date}.${transaction.id}`}
                        transaction={transaction}
                        source={source}
                        sourceParent={sourceParent}
                        target={target}
                        targetParent={targetParent}
                      />
                    )
                  })}
                </DateGroup>
              ))
            }
          </div>
          <span className="content-[''] h-9 block my-2" />
        </div>
      </div>
    </Fragment>
  )
}