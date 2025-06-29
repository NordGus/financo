import { use } from "react";
import { Link, Outlet } from "react-router";
import { list as listCategoriesQuery } from "~/modules/categories/api/queries/list";
import { NoCategoriesForKind } from "~/modules/categories/components/no-categories-for-kind";
import { CategoryPreview } from "~/modules/categories/components/previews/category";
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
              categories.expense.map((category) => (
                <Link
                  key={`account.${category.id}`}
                  to={{ pathname: category.id.toString() }}
                >
                  <CategoryPreview
                    kind={category.kind}
                    name={category.name}
                    description={category.description}
                    color={category.color}
                    icon={category.icon}
                    archivedAt={category.archivedAt}
                    archivedChildren={
                      category.children.reduce(
                        (acc, child) => (child.archivedAt && child.kind ? acc + 1 : acc),
                        0
                      )
                    }
                    activeChildren={
                      category.children.reduce(
                        (acc, child) => (child.archivedAt ? acc : acc + 1),
                        0
                      )
                    }
                  />
                </Link>
              ))
            }
            {categories.expense.length === 0 && (<NoCategoriesForKind kind="expense" archived={filters.archived} />)}
            <Heading2 className="flex items-center gap-2">
              Income
            </Heading2>
            {
              categories.income.map((category) => (
                <Link
                  key={`account.${category.id}`}
                  to={{ pathname: category.id.toString() }}
                >
                  <CategoryPreview
                    kind={category.kind}
                    name={category.name}
                    description={category.description}
                    color={category.color}
                    icon={category.icon}
                    archivedAt={category.archivedAt}
                    archivedChildren={
                      category.children.reduce(
                        (acc, child) => (child.archivedAt ? acc + 1 : acc),
                        0
                      )
                    }
                    activeChildren={
                      category.children.reduce(
                        (acc, child) => (child.archivedAt ? acc : acc + 1),
                        0
                      )
                    }
                  />
                </Link>
              ))
            }
            {categories.income.length === 0 && (<NoCategoriesForKind kind="income" archived={filters.archived} />)}
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
