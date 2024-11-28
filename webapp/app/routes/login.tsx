import { Screen } from "~/modules/authentication/screens/login";
import { Route } from "./+types/login";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Access" },
    { name: "description", content: "Access financo" }
  ]
}

export default function Login() {
  return <Screen />
}