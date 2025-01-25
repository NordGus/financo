import { useMemo } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/shared/components/ui/card"
import { icons } from "~/shared/components/ui/icon"
import { colorContrast } from "~/shared/helpers/color-contrast"
import { Account } from "../types/category"

interface Props {
  account: Account
  onClick: () => void
}

export function PreviewCard({ account, onClick }: Props) {
  const color = useMemo(() => account.color, [account.color])
  const contrast = useMemo(() => colorContrast(account.color), [account.color])
  const { active, archived } = useMemo(() => ({
    active: account.children.filter((c) => !c.archivedAt).length,
    archived: account.children.filter((c) => !!c.archivedAt).length
  }), [account.updatedAt, account.children.length])

  return (
    <Card
      className={"flex flex-col cursor-pointer min-h-28"}
      style={{ backgroundColor: color, color: contrast }}
      onClick={onClick}
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex flex-row gap-2 items-center [&_svg]:size-7 font-semibold">
          {icons[account.icon]} {account.name}
        </CardTitle>
        <CardDescription className="opacity-70" style={{ color: contrast }}>
          {account.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2 px-4 pt-2 pb-4 text-sm">
        {active > 0 && !account.archivedAt && (
          <span>
            {active} active {active === 1 ? "child" : "children"}
          </span>
        )}
        {archived > 0 && !account.archivedAt && (
          <span>
            {archived} archived {archived === 1 ? "child" : "children"}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}