import { ArrowDown, ArrowUp } from "lucide-react";
import { use } from "react";
import { createSearchParams, Link, redirect, useLocation } from "react-router";
import { create as createCategoryCommand } from "~/modules/categories/api/commands/create";
import { FormCreateTemplate } from "~/modules/categories/components/forms/form-create-template";
import { ListFiltersContext } from "~/modules/categories/contexts/list-filters-context";
import { categoryKindsManual } from "~/modules/categories/manual/category-kinds-manual";
import { schema as createSchema } from "~/modules/categories/schemas/create";
import { listFiltersToURLSearchParams } from "~/modules/categories/types/filters";
import { Heading2 } from "~/modules/shared/components/ui/headings";
import { Route } from "./+types/new";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const action = createSchema.safeParse(await request.json())

  if (!action.success) throw action.error

  const {
    kind, icon, color, name, description, subcategories
  } = action.data

  const res = await createCategoryCommand({
    kind,
    name,
    description: description ?? null,
    color,
    icon,
    children: subcategories.map(subcategory => ({
      name: subcategory.name,
      description: subcategory.description ?? null,
      icon: subcategory.icon
    }))
  })

  return redirect(`/categories/${res.id}`)
}

export default function New({ }: Route.ComponentProps) {
  const { filters } = use(ListFiltersContext)
  const { pathname, hash } = useLocation()

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {
          !filters.kind && (
            <>
              <Heading2>
                {"What kind of Category you want to create?"}
              </Heading2>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "expense" })).toString(),
                  hash
                }}
              >
                <ArrowDown />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Expense</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {categoryKindsManual.expense.message}
                  </span>
                </span>
              </Link>
              <Link
                className="grid grid-cols-[min-content_1fr] gap-3 border p-3 rounded-lg hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-7 shrink-0 [&_svg]:shrink-0 shadow-xs"
                to={{
                  pathname,
                  search: createSearchParams(listFiltersToURLSearchParams({ ...filters, kind: "income" })).toString(),
                  hash
                }}
              >
                <ArrowUp />
                <span className="flex flex-col gap-4">
                  <span className="text-xl font-bold">Income</span>
                  <span className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {categoryKindsManual.income.message}
                  </span>
                </span>
              </Link>
            </>
          )
        }
        {!!filters.kind && (<FormCreateTemplate kind={filters.kind} />)}
      </div>
    </section>
  )
}