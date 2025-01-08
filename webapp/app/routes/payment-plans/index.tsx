import { Screen } from "~/modules/payment-plans/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Payment Plans" },
    { name: "description", content: "Manage your plans to pay-up your debts" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Payment Plans"
  }
}

export default function Index() {
  return <Screen />
}