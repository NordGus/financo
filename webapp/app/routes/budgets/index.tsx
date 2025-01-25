import { Screen } from "~/modules/budgets/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Budgets" },
    { name: "description", content: "Manage your budgets" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Budgets"
  }
}

export default function Index() {
  return <Screen />
}