import { use } from "react";
import { Outlet } from "react-router";
import { list as listCategoriesQuery } from "~/modules/categories/api/queries/list";
import { NoCategoriesForKind } from "~/modules/categories/components/no-categories-for-kind";
import { ListFiltersContext } from "~/modules/categories/contexts/list-filters-context";
import { Category, Kind } from "~/modules/categories/types/category";
import { getListFilters } from "~/modules/categories/utils/router-requests";
import { Heading2 } from "~/modules/shared/components/ui/headings";
import { Route } from "./+types/categories";

type CategoryRecords = Record<Kind, Category[]>

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const filters = getListFilters(request)
  const categories = await listCategoriesQuery(filters)

  // Initializing the map that will convert in the records. This is done to prevent undefined access to an accounts
  // array.
  const map = new Map<Kind, Category[]>([
    ["income", []],
    ["expense", []],
  ])

  const records = Object.fromEntries(categories.reduce(
    (map, account) => map.set(account.kind, [...map.get(account.kind)!, account]),
    map
  ).entries()) as CategoryRecords

  return {
    categories: records
  }
}

export default function CategoriesRoute({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData

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
              Expenses
            </Heading2>
            {
              categories.expense.map((account) => (
                // <Link
                //   key={`account.${account.id}`}
                //   to={{ pathname: account.id.toString() }}
                // >
                //   <Preview
                //     key={`account.${account.id}`}
                //     kind={account.kind}
                //     currency={account.currency}
                //     name={account.name}
                //     description={account.description}
                //     color={account.color}
                //     icon={account.icon}
                //     capital={account.capital}
                //     balance={account.additionalData.balance}
                //     main={account.additionalData.main}
                //     archivedAt={account.archivedAt}
                //   />
                // </Link>
                <span key={account.id}>
                  {account.name}
                </span>
              ))
            }
            {categories.expense.length === 0 && (<NoCategoriesForKind kind="capital" archived={filters.archived} />)}
            <Heading2 className="flex items-center gap-2">
              Income
            </Heading2>
            {
              categories.income.map((account) => (
                // <Link
                //   key={`account.${account.id}`}
                //   to={{ pathname: account.id.toString() }}
                // >
                //   <Preview
                //     key={`account.${account.id}`}
                //     kind={account.kind}
                //     currency={account.currency}
                //     name={account.name}
                //     description={account.description}
                //     color={account.color}
                //     icon={account.icon}
                //     capital={account.capital}
                //     balance={account.additionalData.balance}
                //     main={account.additionalData.main}
                //     archivedAt={account.archivedAt}
                //   />
                // </Link>
                <span key={account.id}>
                  {account.name}
                </span>
              ))
            }
            {categories.income.length === 0 && (<NoCategoriesForKind kind="savings" archived={filters.archived} />)}
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
