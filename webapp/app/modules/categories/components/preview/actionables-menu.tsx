import { EllipsisIcon, PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { redirect } from "react-router"
import { Button } from "~/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/shared/components/ui/dropdown-menu"
import { isCategory } from "~/shared/types/account"
import { Account } from "../../types/preview"
import { ArchiveDialog } from "../dialogs/archive"
import { DeleteDialog } from "../dialogs/delete"
import { UnarchiveDialog } from "../dialogs/unarchive"

interface Props {
  account: Account
}

export function ActionablesMenu({ account: { id, name, kind, archivedAt, transactions, children } }: Props) {
  const [openUnarchiveDialog, setOpenUnarchiveDialog] = useState(false)
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={!isCategory(kind)}>
          <Button variant="outline" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {archivedAt && (
            <DropdownMenuItem onClick={() => setOpenUnarchiveDialog(true)}>
              <PackageOpenIcon /> Unarchive
            </DropdownMenuItem>
          )}
          {!archivedAt && (
            <DropdownMenuItem onClick={() => setOpenArchiveDialog(true)}>
              <PackageIcon /> Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UnarchiveDialog
        account={{ id, name, transactions, children: children.length }}
        open={openUnarchiveDialog}
        onOpenChanged={setOpenUnarchiveDialog}
        onSuccess={() => {
          setOpenUnarchiveDialog(false)
          redirect(".")
        }}
      />

      <ArchiveDialog
        account={{ id, name, transactions, children: children.length }}
        open={openArchiveDialog}
        onOpenChanged={setOpenArchiveDialog}
        onSuccess={() => {
          setOpenArchiveDialog(false)
          redirect(".")
        }}
      />

      <DeleteDialog
        account={{ id, name, transactions, children: children.length }}
        open={openDeleteDialog}
        onOpenChanged={setOpenDeleteDialog}
        onSuccess={() => {
          setOpenDeleteDialog(false)
          redirect(".")
        }}
      />
    </>
  )
}