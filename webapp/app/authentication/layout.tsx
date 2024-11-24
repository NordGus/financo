import { Outlet } from "react-router";
import { Heading1 } from "~/components/ui/headings";
import { cn } from "~/lib/utils";


export default function Layout() {
  return (
    <main
      className={cn(
        "h-full",
        "grid grid-cols-2 justify-center items-center gap-4",
        "overflow-hidden"
      )}
    >
      <Heading1 className="text-right">
        log into <span className="font-bold text-primary">financo</span>
      </Heading1>

      <div
        className={cn(
          "grow h-full",
          "flex flex-col gap-4 justify-center items-center",
          "overflow-x-hidden overflow-y-auto"
        )}
      >
        <Outlet />
      </div>
    </main>
  )
}