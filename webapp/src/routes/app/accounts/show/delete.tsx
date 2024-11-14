import { Detailed } from "@/types/Account"
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
import { Form } from "react-router-dom"

interface DeleteAccountProps {
    account: Detailed
}

function Delete({ account: { id, name } }: DeleteAccountProps) {
    return (
        <AlertDialog>
            <div className="flex flex-col">
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className="font-bold">{name}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form
                        className="inline-flex p-0 m-0"
                        method="delete"
                        action={`/accounts/${id}`}
                    >
                        <AlertDialogAction type="submit" className="grow">Confirm</AlertDialogAction>
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { Delete }
