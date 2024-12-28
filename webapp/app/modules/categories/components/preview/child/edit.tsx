import { EditIcon, PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { redirect } from "react-router"
import { Button } from "~/shared/components/ui/button"
import { icons } from "~/shared/components/ui/icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip"
import { Icon } from "~/shared/types/icon"
import { ArchiveDialog } from "../../dialogs/child/archive"
import { DeleteDialog } from "../../dialogs/child/delete"
import { UnarchiveDialog } from "../../dialogs/child/unarchive"

interface Props {
  child: {
    id: number
    name: string
    description?: string
    icon: Icon
    archivedAt?: string | null
    transactions?: number
  }
  onEditClick: () => void
}

export function Preview({ child: { id, name, description, icon, archivedAt, transactions = 0 }, onEditClick }: Props) {
  const [openArchive, setOpenArchive] = useState(false)
  const [openUnarchive, setOpenUnarchive] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <>
      <div className="flex flex-row gap-2 py-2 items-center">
        <div className="flex flex-col gap-2 grow">
          <span
            className="flex flex-row items-center text-lg gap-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
          >
            {icons[icon]} {name}
          </span>
          <span className="text-muted-foreground text-sm">{description}</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant={"outline"} size={"icon"} onClick={onEditClick}>
              <EditIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        {id > 0 && archivedAt && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant={"outline"} size={"icon"} onClick={() => setOpenUnarchive(true)}>
                <PackageOpenIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Unarchive</TooltipContent>
          </Tooltip>
        )}
        {id > 0 && !archivedAt && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant={"outline"} size={"icon"} onClick={() => setOpenArchive(true)}>
                <PackageIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
        )}
        {id > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant={"destructive"} size={"icon"} onClick={() => setOpenDelete(true)}>
                <TrashIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        )}
      </div>

      <ArchiveDialog
        account={{ id, name, transactions }}
        open={openArchive}
        onOpenChanged={setOpenArchive}
        onSuccess={() => {
          redirect(".")
          setOpenArchive(false)
        }}
      />

      <UnarchiveDialog
        account={{ id, name }}
        open={openUnarchive}
        onOpenChanged={setOpenUnarchive}
        onSuccess={() => {
          redirect(".")
          setOpenUnarchive(false)
        }}
      />

      <DeleteDialog
        account={{ id, name, transactions }}
        open={openDelete}
        onOpenChanged={setOpenDelete}
        onSuccess={() => {
          redirect(".")
          setOpenDelete(false)
        }}
      />
    </>
  )
}