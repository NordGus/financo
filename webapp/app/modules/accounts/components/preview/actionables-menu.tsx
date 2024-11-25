import { EllipsisIcon, Package2Icon, PackageOpenIcon, TrashIcon } from "lucide-react"
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

interface Props {
  account: {
    id: number
    name: string
    transactionCount: number
  },
  isArchived: boolean
}

// TODO implement form and actions
export function ActionablesMenu({
  account: {
    name,
    transactionCount
  },
  isArchived
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
          <DropdownMenuItem>
            {
              isArchived
                ? <><PackageOpenIcon /> unarchive</>
                : <><Package2Icon /> archive</>
            }
          </DropdownMenuItem>
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
            this action cannot be undone. this will permanently delete <span className="font-bold">{name}</span> from your accounts. and it will also permanently delete <span className="font-bold">{transactionCount}</span> transaction(s) associated to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>cancel</AlertDialogCancel>
          <AlertDialogAction>confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}