import { Screen } from "~/modules/accounts/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - accounts" },
    { name: "description", content: "manage your accounts" }
  ]
}

export async function loader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "accounts"
  }
}

export default function Index() {
  return <Screen />
}