import { Screen } from "~/modules/morning-brew/screens/morning-brew";
import { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - morning brew" },
    { name: "description", content: "welcome to financo" }
  ]
}

export default function Home() {
  return <Screen />
}