import { use } from "react";
import { Link, Outlet } from "react-router";
import { list as listAccountsQuery } from "~/modules/accounts/api/queries/list";
import { NoAccountsForKind } from "~/modules/accounts/components/no-accounts-for-kind";
import { ListFiltersContext } from "~/modules/accounts/contexts/list-filters-context";
import { accountKindsManual } from "~/modules/accounts/manual/account-kinds-manual";
import { Account, Kind } from "~/modules/accounts/types/accounts";
import { getListFilters } from "~/modules/accounts/utils/router-requests";
import { InfoDialog } from "~/modules/shared/components/dialogs/info";
import { Preview } from "~/modules/shared/components/previews/accounts";
import { Heading2 } from "~/modules/shared/components/ui/headings";
import { Route } from "./+types/accounts";

type AccountRecords = Record<Kind, Account[]>

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const accounts = await listAccountsQuery(getListFilters(request))

  // Initializing the map that will convert in the records. This is done to prevent undefined access to an accounts
  // array.
  const map = new Map<Kind, Account[]>([
    ["capital", []],
    ["savings", []],
    ["debt", []],
    ["credit", []],
  ])

  const records = Object.fromEntries(accounts.reduce(
    (map, account) => map.set(account.kind, [...map.get(account.kind)!, account]),
    map
  ).entries()) as AccountRecords

  return {
    accounts: records
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { accounts } = loaderData

  const { filters } = use(ListFiltersContext)

  return (
    <>
      <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
        <div className="flex flex-col flex-1 overflow-y-hidden relative">
          <span
            className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
          />
          <div className="flex flex-col flex-1 gap-2 py-2 overflow-y-scroll no-scrollbar">
            <Heading2 className="flex items-center gap-2">
              Capital <InfoDialog copy={accountKindsManual.capital} />
            </Heading2>
            {
              accounts.capital.map((account) => (
                <Link
                  key={`account.${account.id}`}
                  to={{ pathname: account.id.toString() }}
                >
                  <Preview
                    kind={account.kind}
                    currency={account.currency}
                    name={account.name}
                    description={account.description}
                    color={account.color}
                    icon={account.icon}
                    capital={account.capital}
                    balance={account.additionalData.balance}
                    main={account.additionalData.main}
                    archivedAt={account.archivedAt}
                  />
                </Link>
              ))
            }
            {accounts.capital.length === 0 && (<NoAccountsForKind kind="capital" archived={filters.archived} />)}
            <Heading2 className="flex items-center gap-2">
              Savings <InfoDialog copy={accountKindsManual.savings} />
            </Heading2>
            {
              accounts.savings.map((account) => (
                <Link
                  key={`account.${account.id}`}
                  to={{ pathname: account.id.toString() }}
                >
                  <Preview
                    kind={account.kind}
                    currency={account.currency}
                    name={account.name}
                    description={account.description}
                    color={account.color}
                    icon={account.icon}
                    capital={account.capital}
                    balance={account.additionalData.balance}
                    main={account.additionalData.main}
                    archivedAt={account.archivedAt}
                  />
                </Link>
              ))
            }
            {accounts.savings.length === 0 && (<NoAccountsForKind kind="savings" archived={filters.archived} />)}
            <Heading2 className="flex items-center gap-2">
              Debts <InfoDialog copy={accountKindsManual.debt} />
            </Heading2>
            {
              accounts.debt.map((account) => (
                <Link
                  key={`account.${account.id}`}
                  to={{ pathname: account.id.toString() }}
                >
                  <Preview
                    kind={account.kind}
                    currency={account.currency}
                    name={account.name}
                    description={account.description}
                    color={account.color}
                    icon={account.icon}
                    capital={account.capital}
                    balance={account.additionalData.balance}
                    main={account.additionalData.main}
                    archivedAt={account.archivedAt}
                  />
                </Link>
              ))
            }
            {accounts.debt.length === 0 && (<NoAccountsForKind kind="debt" archived={filters.archived} />)}
            <Heading2 className="flex items-center gap-2">
              Credit <InfoDialog copy={accountKindsManual.credit} />
            </Heading2>
            {
              accounts.credit.map((account) => (
                <Link
                  key={`account.${account.id}`}
                  to={{ pathname: account.id.toString() }}
                >
                  <Preview
                    kind={account.kind}
                    currency={account.currency}
                    name={account.name}
                    description={account.description}
                    color={account.color}
                    icon={account.icon}
                    capital={account.capital}
                    balance={account.additionalData.balance}
                    main={account.additionalData.main}
                    archivedAt={account.archivedAt}
                  />
                </Link>
              ))
            }
            {accounts.credit.length === 0 && (<NoAccountsForKind kind="credit" archived={filters.archived} />)}
          </div>
          <span
            className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
          />
        </div>
      </section>
      <Outlet />
    </>
  )
}