import { NavLink as RouterNavLink } from "react-router-dom"

interface Props {
    name: string,
    path: string
}

function NavLink({ name, path }: Props) {
    return (
        <RouterNavLink
            to={path}
            className={({ isActive, isPending }) => [
                "flex justify-end items-end",
                "py-1 px-2 h-10",
                "border rounded dark:border-neutral-800",
                "bg-neutral-50 dark:bg-neutral-900",
                "shadow duration-200",
                isActive
                    ? "w-full font-bold"
                    : isPending
                        ? "w-full animate-pulse"
                        : "w-[85%] hover:w-full",
            ].join(" ")
            }
        >
            {name}
        </RouterNavLink>
    )
}

export default NavLink