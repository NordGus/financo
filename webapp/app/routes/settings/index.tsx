import { Screen } from "~/modules/payment-plans/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Settings" },
    { name: "description", content: "Customize your financo experience" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Settings"
  }
}

export default function Index() {
  return <Screen />
}