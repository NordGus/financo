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
              <TrashIcon /> delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-1">
            this action cannot be undone. this will permanently delete <span className="font-bold">{name}</span> from your accounts. and it will also permanently delete <span className="font-bold">{transactions}</span> transaction(s) associated to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>cancel</AlertDialogCancel>
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
            confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}