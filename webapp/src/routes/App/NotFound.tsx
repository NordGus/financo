import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card"
import { useLocation } from "react-router-dom"

export default function NotFound() {
    const { pathname } = useLocation()

    return (
        <div className="h-[100dvh] flex justify-center items-center">
            <Card className="w-[30dvw]">
                <CardHeader>
                    <CardTitle>404</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <i>Can't find route: {pathname}</i>
                </CardContent>
            </Card>
        </div>
    )
}
