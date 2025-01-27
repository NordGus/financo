import { Outlet } from "react-router";
import { cn } from "~/lib/utils";
import { Heading1 } from "~/modules/shared/components/ui/headings";

export default function Layout() {
  return (
    <main
      className={cn(
        "h-full",
        "grid grid-cols-2 justify-center items-center gap-8",
        "overflow-hidden"
      )}
    >
      <Heading1 className="text-right">
        Welcome to <span className="font-bold text-primary">financo</span>
      </Heading1>

      <div
        className={cn(
          "grow h-full",
          "flex flex-col gap-4 justify-center",
          "overflow-y-auto",
          "px-1"
        )}
      >
        <Outlet />
      </div>
    </main>
  )
}