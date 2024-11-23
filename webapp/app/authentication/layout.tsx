import { Outlet } from "react-router";


export default function Layout() {
    return (
        <main>
            <h1>Hello</h1>

            <Outlet />
        </main>
    )
}