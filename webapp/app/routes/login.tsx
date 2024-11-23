import { Login as Screen } from "~/authentication/screens/login"
import { Route } from "./+types/login"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'financo - login' },
        { name: 'description', content: 'Welcome to financo' }
    ]
}

export default function Login() {
    return <Screen />
}