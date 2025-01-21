import { useMemo, useState } from "react"
import { redirect } from "react-router"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/shared/components/ui/card"
import { Drawer, DrawerContent } from "~/shared/components/ui/drawer"
import { icons } from "~/shared/components/ui/icon"
import { colorContrast } from "~/shared/helpers/color-contrast"
import { isCategory } from "~/shared/types/account"
import { Account } from "../../types/preview"
import { UpdateCategory } from "../forms/update"

interface Props {
  account: Account
  isArchived: (archivedAt?: string | null) => boolean
}

export function Preview({ account }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const activeCount = useMemo(() => account.children.filter((c) => !c.archivedAt).length, [account.updatedAt])
  const archivedCount = useMemo(() => account.children.filter((c) => !!c.archivedAt).length, [account.updatedAt])

  return (
    <>
      <Card
        className={"flex flex-col cursor-pointer min-h-28"}
        style={{
          backgroundColor: account.color,
          color: colorContrast(account.color)
        }}
        onClick={() => setOpenEdit(true)}
      >
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="flex flex-row gap-1 items-center [&_svg]:size-5">
            {icons[account.icon]} {account.name}
          </CardTitle>
          <CardDescription className="opacity-70" style={{ color: colorContrast(account.color) }}>
            {account.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2 px-4 pt-2 pb-4 text-sm">
          {activeCount > 0 && !account.archivedAt && (
            <span>
              {activeCount} active {activeCount === 1 ? "child" : "children"}
            </span>
          )}
          {archivedCount > 0 && !account.archivedAt && (
            <span>
              {archivedCount} archived {archivedCount === 1 ? "child" : "children"}
            </span>
          )}
        </CardFooter>
      </Card>

      {
        isCategory(account.kind) && (
          <Drawer modal open={openEdit} onOpenChange={setOpenEdit}>
            <DrawerContent>
              <UpdateCategory
                account={account}
                onSuccess={() => {
                  redirect(".")
                  setOpenEdit(false)
                }}
              />
            </DrawerContent>
          </Drawer>
        )
      }
    </>
  )
}