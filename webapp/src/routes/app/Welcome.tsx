function Welcome() {
    return (
        <div
            className="p-1.5
            flex flex-col justify-center items-center gap-1
            h-full
            border rounded-lg dark:border-neutral-800
            bg-neutral-50 dark:bg-neutral-900
            shadow"
        >
            <h1 className="text-4xl">Welcome to financo</h1>
            <p>Your personal finances helper</p>
        </div>
    )
}

export default Welcome