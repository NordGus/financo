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

export default NavLink