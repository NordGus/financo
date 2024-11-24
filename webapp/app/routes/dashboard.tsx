import { Screen } from "~/dashboard/screens/dashboard";
import { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo" },
    { name: "description", content: "welcome to financo" }
  ]
}

export default function Dashboard() {
  return <Screen />
}