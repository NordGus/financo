import { Goal } from "@/types/Goal"
import { Dispatch, SetStateAction } from "react"
import { useOutletContext } from "react-router-dom"

interface OutletContext {
    setOpen: Dispatch<SetStateAction<boolean>>
    setGoal: Dispatch<SetStateAction<Goal | NonNullable<unknown>>>
}

export default function Index() {
    const { setOpen, setGoal } = useOutletContext<OutletContext>()

    return (
        <div>
            Hello There
        </div>
    )
}