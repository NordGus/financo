import { format } from "date-fns";
import { Info } from "lucide-react";
import { Outlet } from "react-router";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { list as listPendingTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list-pending";
import { MoveDateRangeLink } from "~/modules/ledger/components/buttons/move-date-rage-link";
import { TransactionsSearchResults } from "~/modules/ledger/components/transactions-search-results";
import { mapToExecutedTransactions, mapToPendingTransactions } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { Route } from "./+types/ledger";

const DATE_FORMAT_STRING = "PPP"

export async function clientLoader({ request }: Route.LoaderArgs) {
  const filters = getFilters(request)

  const [executed, pending] = await Promise.allSettled([
    listTransactionsQuery(filters),
    listPendingTransactionsQuery(filters)
  ])

  if (executed.status === "rejected") throw executed.reason
  if (pending.status === "rejected") throw pending.reason

  return {
    filters,
    executedTransactions: mapToExecutedTransactions(executed.value),
    pendingTransactions: mapToPendingTransactions(pending.value)
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { filters, executedTransactions, pendingTransactions } = loaderData

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative">
        {
          pendingTransactions.length > 0 && (
            <Accordion
              className="max-h-[35dvh] flex flex-col justify-stretch"
              type="single"
              collapsible
            >
              <AccordionItem value="pending" className="flex flex-col h-full overflow-y-auto no-scrollbar relative rounded-lg overflow-clip border-b!">
                <AccordionTrigger className="items-center px-4 rounded-none">
                  <div className="flex gap-2 items-center">
                    <p className="leading-none">Pending Transactions</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0 [&_svg]:text-muted-foreground cursor-pointer">
                          <Info />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {"Transactions which do not have execution date"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative pb-4">
                  <TransactionsSearchResults transactions={pendingTransactions} />
                  <span
                    className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )
        }
        <div className="flex-2 flex flex-col gap-2 h-full overflow-y-hidden rounded-lg overflow-clip">
          <div className="flex justify-between">
            <MoveDateRangeLink direction="backwards" variant={"outline"} />
            <span className="h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium flex-1 inline-flex justify-center items-center">
              {
                filters.period === "unlimited"
                  ? (<>{"Entire Ledger History"}</>)
                  : filters.period === "daily"
                    ? (
                      <span className="font-bold">
                        {format(filters.from!, DATE_FORMAT_STRING)}
                      </span>
                    )
                    : (
                      <span>
                        {"From "}
                        <span className="font-bold">
                          {format(filters.from!, DATE_FORMAT_STRING)}
                        </span>
                        {" to "}
                        <span className="font-bold">
                          {format(filters.to!, DATE_FORMAT_STRING)}
                        </span>
                      </span>
                    )
              }
            </span>
            <MoveDateRangeLink direction="forwards" variant={"outline"} />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar relative pb-4">
            <TransactionsSearchResults transactions={executedTransactions} futureEnable />
          </div>
        </div>
        <span
          className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
        />
      </section>
      <Outlet />
    </>
  )
}
