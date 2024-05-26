import { Outlet } from "react-router-dom"
import NavLink from "../components/NavLink"

function App() {
    return (
        <div className='w-full h-[100dvh] grid grid-cols-[15dvw_minmax(0,_1fr)] gap-1 p-1'>
            <nav className='flex flex-col gap-1 h-full p-0 m-0'>
                <NavLink name="Accounts & Goals" />
                <NavLink name="Books" />
                <NavLink name="Budgets" />
                <NavLink name="Payment Plans" />
                <NavLink name="Summary" />
                <NavLink name="Intelligence" />
            </nav>
            <div className='block h-full overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default App
