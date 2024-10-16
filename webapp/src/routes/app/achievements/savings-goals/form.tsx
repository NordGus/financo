import { SavingsGoal } from "@/types/savings-goal";

interface Props {
    goal: SavingsGoal | NonNullable<unknown>
    onSetOpenForm: (open: boolean) => void
}

function Form(_props: Props) {
    return (
        <div>
            Hello There
        </div>
    )
}

export { Form };
