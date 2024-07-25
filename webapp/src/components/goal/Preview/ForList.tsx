import Goal from "@/types/Goal";

import Base from "./Base";

interface Props {
    goal: Goal
}

export default function ForList({ goal }: Props) {
    return (
        <div className="grid grid-cols-[minmax(0,_1fr)_min-content] gap-2 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Base goal={goal} />
        </div>
    )
}