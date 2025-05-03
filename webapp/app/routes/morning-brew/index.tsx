import { Screen } from "~/modules/morning-brew/screens/morning-brew";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Morning brew" },
    { name: "description", content: "Welcome to financo" }
  ]
}

export default function Index() {
  return <Screen />
}