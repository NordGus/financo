import { Goal } from "@/types/Goal";

interface Props {
    goal: Goal | NonNullable<unknown>
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
