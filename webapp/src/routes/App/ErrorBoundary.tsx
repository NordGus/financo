import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { useRouteError } from "react-router-dom"

export default function ErrorBoundary() {
    const error: any = useRouteError()

    console.error(error)

    return (
        <div className="flex justify-center items-center h-[100dvh] dark:bg-zinc-950">
            <Card className="w-[60dvw] m-auto">
                <CardHeader>
                    <CardTitle>Oops!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="opacity-75">Sorry, an unexpected error has occurred.</p>
                    <p className="rounded bg-red-400/50 text-red-500 p-4">
                        <i>{error.statusText || error.message}</i>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
