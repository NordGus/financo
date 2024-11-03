import { SavingsGoal } from "@/types/savings-goal";
import { SheetHeader, SheetTitle } from "@components/ui/sheet";

interface Props {
    goal: SavingsGoal
    onSetOpenForm: (open: boolean) => void
}

function EditForm({ goal }: Props) {
    return (
        <>
            <SheetHeader>
                <SheetTitle>Edit Savings Goal</SheetTitle>
            </SheetHeader>
            <div>
                {goal.name}
            </div>
        </>
    )
}

export { EditForm };
