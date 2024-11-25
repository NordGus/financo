import { Screen } from "~/modules/ledger/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - ledger" },
    { name: "description", content: "manage your wealth's transactions" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "ledger"
  }
}

export default function Index() {
  return <Screen />
}