import { Goal } from "@/types/Goal"
import { Dispatch, SetStateAction } from "react"
import { useLoaderData, useOutletContext } from "react-router-dom"
import { loader } from "./loader"

interface OutletContext {
    setOpen: Dispatch<SetStateAction<boolean>>
    setGoal: Dispatch<SetStateAction<Goal | NonNullable<unknown>>>
}

export default function Index() {
    const { setOpen, setGoal } = useOutletContext<OutletContext>()
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div>
            Hello There
        </div>
    )
}