import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/shared/components/ui/card"
import { Dialog, DialogContent } from "~/shared/components/ui/dialog"
import { icons } from "~/shared/components/ui/icon"
import { accountKindToHuman } from "~/shared/helpers/account-kind-to-human"
import { colorContrast } from "~/shared/helpers/color-contrast"
import { isCategory, isExpense, isIncome } from "~/shared/types/account"
import { Account } from "../../types/preview"
import { UpdateCategory } from "../forms/update"
import { ActionablesMenu } from "./actionables-menu"

interface Props {
  account: Account
  isArchived: (archivedAt?: string | null) => boolean
}

export function Preview({ account, isArchived }: Props) {
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <>
      <Card
        className="flex flex-col cursor-pointer"
        style={{ backgroundColor: account.color }}
      >
        <CardHeader
          className="min-h-28"
          style={{ color: colorContrast(account.color) }}
          onClick={() => setOpenEdit(true)}
        >
          <CardTitle className="flex flex-row gap-1 items-center [&_svg]:size-5">
            {icons[account.icon]} {account.name}
          </CardTitle>
          <CardDescription style={{ color: colorContrast(account.color), opacity: "70%", }}>
            {account.description}
          </CardDescription>
        </CardHeader>
        <CardContent
          className="flex flex-wrap gap-2 grow"
          style={{ color: colorContrast(account.color) }}
          onClick={() => setOpenEdit(true)}
        >
          {account.children.filter((c) => isArchived(c.archivedAt)).map((child) => (
            <span
              key={`category.${account.id}.${child.id}`}
              className="rounded-md px-2 py-0.5 border text-sm"
              style={{ borderColor: colorContrast(account.color) }}
            >
              {child.name}
            </span>
          ))}
        </CardContent>
        <CardFooter className="flex gap-2 items-center">
          {
            !(isExpense(account.kind) || isIncome(account.kind)) && (
              <span style={{ color: colorContrast(account.color) }}>
                {accountKindToHuman(account.kind)}
              </span>
            )
          }
          <span className="grow content-['']" />
          <ActionablesMenu account={account} />
        </CardFooter>
      </Card>

      {
        isCategory(account.kind) && (
          <Dialog modal open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent>
              <UpdateCategory
                account={account}
                onSuccess={() => { }}
              />
            </DialogContent>
          </Dialog>
        )
      }
    </>
  )
}