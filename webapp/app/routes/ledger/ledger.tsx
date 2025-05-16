import { Info } from "lucide-react";
import { Outlet } from "react-router";
import { list as listTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list";
import { list as listPendingTransactionsQuery } from "~/modules/ledger/api/queries/transactions/list-pending";
import { TransactionsSearchResults } from "~/modules/ledger/components/transactions-search-results";
import { mapToExecutedTransactions, mapToPendingTransactions } from "~/modules/ledger/types/transactions";
import { getFilters } from "~/modules/ledger/utils/router-requests";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/modules/shared/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { Route } from "./+types/ledger";


export async function clientLoader({ request }: Route.LoaderArgs) {
  const [executed, pending] = await Promise.allSettled([
    listTransactionsQuery(getFilters(request)),
    listPendingTransactionsQuery(getFilters(request))
  ])

  if (executed.status === "rejected") throw executed.reason
  if (pending.status === "rejected") throw pending.reason

  return {
    breadcrumb: "Ledger",
    executedTransactions: mapToExecutedTransactions(executed.value),
    pendingTransactions: mapToPendingTransactions(pending.value)
  }
}

export default function Index({
  loaderData: {
    executedTransactions,
    pendingTransactions
  },
  matches
}: Route.ComponentProps) {
  const { data: { accountsMap } } = matches[2] // extracting data from webapp/app/routes/ledger/_layout.tsx's loader.

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden no-scrollbar relative my-2">
        {
          pendingTransactions.length > 0 && (
            <Accordion
              className="max-h-[35dvh] flex flex-col justify-stretch"
              type="single"
              collapsible
            >
              <AccordionItem value="pending" className="flex flex-col h-full overflow-y-auto no-scrollbar relative rounded-lg overflow-clip border!">
                <AccordionTrigger className="items-center px-4 [&[data-state=open]]:border-b! rounded-none">
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
                <AccordionContent className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative">
                  <TransactionsSearchResults
                    transactions={pendingTransactions}
                    accounts={accountsMap}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )
        }
        <div className="flex-2 flex flex-col h-full overflow-y-auto no-scrollbar relative rounded-lg overflow-clip border">
          <TransactionsSearchResults transactions={executedTransactions} accounts={accountsMap} futureEnable />
        </div>
      </section>
      <Outlet />
    </>
  )
}
