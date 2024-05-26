import { Outlet } from "react-router-dom"

type NavLinkProps = {
    name: string
}

function NavLink({ name }: NavLinkProps) {
    return (
        <a
            className="px-4 py-1.5
        flex justify-end items-end
        w-[85%] hover:w-full h-14
        border rounded-lg dark:border-neutral-800
        bg-neutral-50 dark:bg-neutral-900
        shadow
        hover:font-bold
        duration-200"
        >
            {name}
        </a>
    )
}

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
