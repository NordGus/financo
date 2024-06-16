import { useLocation } from "react-router-dom"

export default function NotFound() {
    const { pathname } = useLocation()

    return (
        <div
            className="p-1.5 flex flex-col justify-center items-center h-full border rounded dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow"
        >
            <h1 className="text-4xl mb-5 font-bold">404</h1>
            <p className="opacity-50">
                <i>Can't find route: {pathname}</i>
            </p>
        </div>
    )
}
