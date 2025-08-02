import { Route } from "./+types/index";

export default function New({ }: Route.ComponentProps) {
  // TODO: implement the summary screen with interesting graphs

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