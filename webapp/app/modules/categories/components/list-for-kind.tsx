import { Card } from "~/modules/shared/components/ui/card";
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human";
import { Category, Kind } from "../types/category";
import { PreviewCard } from "./preview-card";

interface Props {
  categories: Category[]
  kind: Kind
  forArchived: boolean
  onClick: (account: Category) => void
}

export function ListForKind({ categories, forArchived, kind, onClick }: Props) {
  const filtered = categories
    .filter((account) => account.kind === kind && !account.deletedAt)
    .filter(({ archivedAt }) => !!archivedAt === forArchived)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((category) => (
        <PreviewCard
          key={`category.${category.id}`}
          category={category}
          onClick={() => onClick(category)}
        />
      ))}
      {
        filtered.length === 0 && (
          <Card className="text-muted-foreground text-center p-4">
            {
              forArchived
                ? `No ${accountKindToHuman(kind)} Categories have been archived`
                : `No ${accountKindToHuman(kind)} Categories are active`
            }
          </Card>
        )
      }
    </div>
  )
}