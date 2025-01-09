import { EllipsisIcon, PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react"
import { useEffect, useReducer } from "react"
import { redirect } from "react-router"
import { Button } from "~/shared/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "~/shared/components/ui/drawer"
import { Account } from "../../types/preview"
import { ArchiveDialog } from "../dialogs/archive"
import { DeleteDialog } from "../dialogs/delete"
import { UnarchiveDialog } from "../dialogs/unarchive"

interface Props {
  account: Account
}

interface InitialState {
  archivedAt?: string | null
}

interface State {
  archived: boolean
  open: boolean
  delete: boolean
  archive: boolean
  unarchive: boolean
}

type Action =
  { type: "OPEN_CHANGED", value: boolean } |
  { type: "DELETE_CHANGED", value: boolean } |
  { type: "ARCHIVE_CHANGED", value: boolean } |
  { type: "UNARCHIVE_CHANGED", value: boolean } |
  { type: "ARCHIVED_AT_CHANGED", value: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_CHANGED":
      return { ...state, open: action.value }
    case "DELETE_CHANGED":
      return { ...state, delete: action.value }
    case "ARCHIVE_CHANGED":
      return { ...state, archive: action.value }
    case "UNARCHIVE_CHANGED":
      return { ...state, unarchive: action.value }
    case "ARCHIVED_AT_CHANGED":
      return { ...state, archived: action.value }
    default:
      throw new Error(`invalid action`)
  }
}

function init({ archivedAt }: InitialState): State {
  return {
    archived: !!archivedAt,
    open: false,
    delete: false,
    archive: false,
    unarchive: false,
  }
}

export function ActionablesMenu({ account: { id, name, archivedAt, additionalData: { transactions } } }: Props) {
  const [state, dispatch] = useReducer(reducer, { archivedAt }, init)

  const onOpenChanged = (value: boolean) => dispatch({ type: "OPEN_CHANGED", value })
  const onUnarchiveChanged = (value: boolean) => dispatch({ type: "UNARCHIVE_CHANGED", value })
  const onArchiveChanged = (value: boolean) => dispatch({ type: "ARCHIVE_CHANGED", value })
  const onDeleteChanged = (value: boolean) => dispatch({ type: "DELETE_CHANGED", value })

  useEffect(() => dispatch({ type: "ARCHIVED_AT_CHANGED", value: !!archivedAt }), [archivedAt])

  return (
    <>
      <Button variant="link" size="icon" onClick={() => onOpenChanged(true)}>
        <EllipsisIcon />
      </Button>

      <Drawer open={state.open} onOpenChange={onOpenChanged}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Manage Account</DrawerTitle>
            <DrawerDescription>What action you want to take?</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 flex flex-col gap-4">
            {
              state.archived
                ? (
                  <Button variant={"outline"} onClick={() => onUnarchiveChanged(true)}>
                    <PackageOpenIcon /> Unarchive
                  </Button>
                )
                : (
                  <Button variant={"outline"} onClick={() => onArchiveChanged(true)}>
                    <PackageIcon /> Archive
                  </Button>
                )
            }
            <Button variant={"destructive"} onClick={() => onDeleteChanged(true)}>
              <TrashIcon /> Delete
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <UnarchiveDialog
        account={{ id, name, transactions }}
        open={state.unarchive}
        onOpenChanged={onUnarchiveChanged}
        onSuccess={() => {
          onUnarchiveChanged(false)
          onOpenChanged(false)
          redirect(".")
        }}
      />

      <ArchiveDialog
        account={{ id, name, transactions }}
        open={state.archive}
        onOpenChanged={onArchiveChanged}
        onSuccess={() => {
          onArchiveChanged(false)
          onOpenChanged(false)
          redirect(".")
        }}
      />

      <DeleteDialog
        account={{ id, name, transactions }}
        open={state.delete}
        onOpenChanged={onDeleteChanged}
        onSuccess={() => {
          onDeleteChanged(false)
          onOpenChanged(false)
          redirect(".")
        }}
      />
    </>
  )
}