import { Screen } from "~/modules/dashboard/screens/dashboard";
import { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo" },
    { name: "description", content: "Welcome to financo" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Dashboard"
  }
}

export default function Dashboard() {
  return <Screen />
}