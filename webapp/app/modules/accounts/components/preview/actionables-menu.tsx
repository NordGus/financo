import { EllipsisIcon, PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "~/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/shared/components/ui/dropdown-menu"
import { Account } from "../../types/preview"
import { ArchiveDialog } from "../dialogs/archive"
import { DeleteDialog } from "../dialogs/delete"
import { UnarchiveDialog } from "../dialogs/unarchive"

interface Props {
  account: Account
}

// TODO implement form and actions
export function ActionablesMenu({ account: { id, name, archivedAt, additionalData: { transactions } } }: Props) {
  const [openUnarchiveDialog, setOpenUnarchiveDialog] = useState(false)
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon">
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
        account={{ id, name, transactions }}
        open={openUnarchiveDialog}
        onOpenChanged={setOpenUnarchiveDialog}
      />

      <ArchiveDialog
        account={{ id, name, transactions }}
        open={openArchiveDialog}
        onOpenChanged={setOpenArchiveDialog}
      />

      <DeleteDialog
        account={{ id, name, transactions }}
        open={openDeleteDialog}
        onOpenChanged={setOpenDeleteDialog}
      />
    </>
  )
}