import { Screen } from "~/modules/achievements/screens";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - achievements" },
    { name: "description", content: "set your goals and remember your progress" }
  ]
}

export async function loader({ }: Route.LoaderArgs) {
  return {
    breadcrumb: "achievements"
  }
}

export default function Index() {
  return <Screen />
}