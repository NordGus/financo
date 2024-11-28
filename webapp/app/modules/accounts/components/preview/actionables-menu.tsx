import { EllipsisIcon, TrashIcon } from "lucide-react"
import { FetcherWithComponents } from "react-router"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/shared/components/ui/alert-dialog"
import { Button } from "~/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/shared/components/ui/dropdown-menu"
import { Account } from "../../types/preview"
import { Archive } from "./actionables/archive"
import { Unarchive } from "./actionables/unrachive"

interface Props {
  account: {
    id: number
    name: string
    transactions: number
  },
  isArchived: boolean
  fetcher: FetcherWithComponents<Account>
}

// TODO implement form and actions
export function ActionablesMenu({
  account: { id, name, transactions },
  isArchived,
  fetcher
}: Props) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isArchived && <Unarchive accountID={id} fetcher={fetcher} />}
          {!isArchived && <Archive accountID={id} fetcher={fetcher} />}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone.
            </p>
            <p>
              You are about to permanently delete <span className="font-bold">{name}</span> from your Accounts and its related <span className="font-bold">{transactions}</span> transaction(s) from your Transaction history.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              fetcher.submit(
                { intent: "delete" },
                {
                  action: `/accounts/${id}`,
                  method: "POST",
                  encType: "application/json"
                }
              )
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}