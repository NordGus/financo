import { SavingsGoal } from "@/types/savings-goal"
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

interface DeleteGoalProps {
    goal: SavingsGoal
    onSetOpenForm: (open: boolean) => void
}

function Delete({ goal, onSetOpenForm }: DeleteGoalProps) {
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
                        This action cannot be undone. This will permanently delete <span className="font-bold">{goal.name}</span> from your savings goals and recalculate your progress.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form
                        className="inline-flex p-0 m-0"
                        method="delete"
                        action={`/achievements/savings-goals/${goal.id}`}
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
