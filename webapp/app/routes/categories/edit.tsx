import { get as getCategoryQuery } from "~/modules/categories/api/queries/get";
import { FormEditTemplate } from "~/modules/categories/components/forms/form-edit-template";
import { Route } from "./+types/edit";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)
  const category = await getCategoryQuery(id)

  return { category }
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