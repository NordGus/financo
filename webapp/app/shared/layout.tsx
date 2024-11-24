import { Outlet } from "react-router";


export default function Layout() {
  return (
    <main
      className="h-full overflow-hidden grid grid-cols-layout"
    >
      <nav className="p-2">
        here
      </nav>
      <div
        className="grow h-full overflow-y-auto overflow-x-auto p-2"
      >
        <Outlet />
      </div>
    </main>
  )
}