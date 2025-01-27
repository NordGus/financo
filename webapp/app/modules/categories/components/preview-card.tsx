import { useMemo } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/modules/shared/components/ui/card"
import { icons } from "~/modules/shared/components/ui/icon"
import { colorContrast } from "~/modules/shared/helpers/color-contrast"
import { Category } from "../types/category"
import { Archived } from "./badges/archived"

interface Props {
  category: Category
  onClick: () => void
}

export function PreviewCard({ category, onClick }: Props) {
  const color = useMemo(() => category.color, [category.color])
  const contrast = useMemo(() => colorContrast(category.color), [category.color])
  const { active, archived } = {
    active: category.children.filter((c) => !c.archivedAt).length,
    archived: category.children.filter((c) => !!c.archivedAt).length
  }

  return (
    <Card
      className={"flex flex-col cursor-pointer min-h-28"}
      style={{ backgroundColor: color, color: contrast }}
      onClick={onClick}
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex flex-row gap-2 items-center [&_svg]:size-7 font-semibold">
          {icons[category.icon]} {category.name}
        </CardTitle>
        <CardDescription className="opacity-70" style={{ color: contrast }}>
          {category.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2 px-4 pt-2 pb-4 text-sm">
        {
          category.archivedAt && (
            <span className="flex-grow">
              <Archived />
            </span>
          )
        }

        {active > 0 && !category.archivedAt && (
          <span>
            {active} active {active === 1 ? "child" : "children"}
          </span>
        )}
        {archived > 0 && !category.archivedAt && (
          <span>
            {archived} archived {archived === 1 ? "child" : "children"}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}