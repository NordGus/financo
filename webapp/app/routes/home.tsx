import { Screen } from "~/modules/morning-brew/screens/morning-brew";
import { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Morning brew" },
    { name: "description", content: "Welcome to financo" }
  ]
}

export default function Home() {
  return <Screen />
}