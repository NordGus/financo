import { Route } from "./+types/index";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
  return {}
}

export default function Index({ }: Route.ComponentProps) {
  // TODO: implement a summary view, probably based on the budgets features

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <span
        className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
      />
      <span
        className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
      />
    </section>
  )
}
