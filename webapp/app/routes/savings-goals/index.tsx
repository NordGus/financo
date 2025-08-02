import { Heading1 } from "~/modules/shared/components/ui/headings";
import { Route } from "./+types/new";

export default function New({ }: Route.ComponentProps) {
  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        <Heading1>Savings Goals Summary Placeholder</Heading1>
      </div>
    </section>
  )
}