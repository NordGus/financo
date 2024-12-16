import { Screen } from "~/modules/categories/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Categories" },
    { name: "description", content: "Manage your Ledger Categories" }
  ]
}

export async function clientAction({ }: Route.ClientActionArgs) {
}

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  return {
    breadcrumb: "Categories"
  }
}

export default function Index() {
  return <Screen />
}