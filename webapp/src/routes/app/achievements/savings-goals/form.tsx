import { SavingsGoal } from "@/types/SavingsGoal";

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
