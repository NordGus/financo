import { Transaction } from "@/types/Transaction"
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
} from "@components/ui/alert-dialog"
import { Button } from "@components/ui/button"
import { Form } from "react-router"

interface DeleteTransactionProps {
    transaction: Transaction
    onSetOpenForm: (open: boolean) => void
}

function Delete({ transaction: { id }, onSetOpenForm }: DeleteTransactionProps) {
    return (
        <AlertDialog>
            <div className="flex flex-col pt-4">
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this transaction from your ledger.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form
                        className="inline-flex p-0 m-0"
                        method="delete"
                        action={`/ledger/${id}`}
                        onSubmit={() => onSetOpenForm(false)}
                    >
                        <AlertDialogAction type="submit" className="grow">Confirm</AlertDialogAction>
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { Delete }
