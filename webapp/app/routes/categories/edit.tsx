import { redirect } from "react-router";
import z from "zod";
import { archive as archiveCategoryCommand } from "~/modules/categories/api/commands/archive";
import { destroy as destroyCategoryCommand } from "~/modules/categories/api/commands/destroy";
import { unarchive as unarchiveCategoryCommand } from "~/modules/categories/api/commands/unarchive";
import { update as updateCategoryCommand } from "~/modules/categories/api/commands/update";
import { get as getCategoryQuery } from "~/modules/categories/api/queries/get";
import { FormEditTemplate } from "~/modules/categories/components/forms/form-edit-template";
import { schema as archiveSchema } from "~/modules/categories/schemas/archive";
import { schema as destroySchema } from "~/modules/categories/schemas/destroy";
import { schema as unarchiveSchema } from "~/modules/categories/schemas/unarchive";
import { schema as updateSchema } from "~/modules/categories/schemas/update";
import { CreateSubcategory, UpdateSubcategory } from "~/modules/categories/types/update";
import { Route } from "./+types/edit";

const actionsSchema = z.union([
  updateSchema,
  archiveSchema,
  unarchiveSchema,
  destroySchema
])

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)
  const category = await getCategoryQuery(id)

  return { category }
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const id = Number(params.id)
  const action = actionsSchema.safeParse(await request.json())

  if (!action.success) throw action.error

  switch (action.data.intent) {
    case "destroy":
      await destroyCategoryCommand(id)

      return redirect(`/categories`)
    case "archive":
      await archiveCategoryCommand(id)

      return redirect(`/categories/${id}`)
    case "unarchive":
      await unarchiveCategoryCommand(id)

      return redirect(`/categories/${id}`)
    case "update":
      await updateCategoryCommand({
        id,
        name: action.data.name,
        description: action.data.description,
        color: action.data.color,
        icon: action.data.icon,
        subcategories: action.data.subcategories.map(subcategory => ({
          id: subcategory.id,
          icon: subcategory.icon,
          name: subcategory.name,
          description: subcategory.description,
          intent: subcategory.intent
        } as (UpdateSubcategory | CreateSubcategory))), // This is a hack!
      })

      return redirect(`/categories/${id}`)
  }
}

export default function Edit({ loaderData }: Route.ComponentProps) {
  const { category } = loaderData

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <FormEditTemplate
          kind={category.kind}
          color={category.color}
          icon={category.icon}
          name={category.name}
          description={category.description}
          archived={!!category.archivedAt}
          subcategories={category.children.map(child => ({
            id: child.id,
            icon: child.icon,
            name: child.name,
            description: child.description,
            archived: !!child.archivedAt
          }))}
        />
      </div>
    </section>
  )
}