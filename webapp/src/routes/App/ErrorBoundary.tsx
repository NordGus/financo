import { useRouteError } from "react-router-dom"

export default function ErrorBoundary() {
    const error: any = useRouteError()

    console.error(error)

    return (
        <div
            className="w-full h-[100dvh] flex flex-col justify-center items-center gap-5"
        >
            <h1 className="text-4xl mb-5 font-bold">Oops!</h1>
            <p className="opacity-75">Sorry, an unexpected error has occurred.</p>
            <p className="opacity-50">
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}
