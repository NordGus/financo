import { Goal } from "@/types/Goal";
import { Dispatch, SetStateAction } from "react";

type Recordable = Goal | NonNullable<unknown>;

interface Props {
    goal: Recordable
    setOpen: Dispatch<SetStateAction<boolean>>
}

function Form(_props: Props) {
    return (
        <div>
            Hello There
        </div>
    )
}

export { Form };
