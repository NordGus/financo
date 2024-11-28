import { Screen } from "~/modules/achievements/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - Achievements" },
    { name: "description", content: "Set your goals and remember your progress" }
  ]
}

export async function clientLoader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "Achievements"
  }
}

export default function Index() {
  return <Screen />
}