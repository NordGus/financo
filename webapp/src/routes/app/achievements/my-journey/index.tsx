import { useLoaderData } from "react-router-dom"
import { loader } from "./loader"

export default function MyJourney() {
    const { timestamp } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>

    return (
        <div>
            This is how far I've come
        </div>
    )
}