import { Screen } from "~/authentication/screens/login";
import { Route } from "./+types/login";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - log in" },
    { name: "description", content: "log into financo" }
  ]
}

export default function Login() {
  return <Screen />
}