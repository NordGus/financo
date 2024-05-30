type Props = {
    progress: number
}

export default function Progress({ progress }: Props) {
    const dasharray = 300
    const fillStrokeWidth = 6
    const baseStrokeWidth = 2

    return (
        <div className="my-auto flex justify-center items-center w-14 h-14 relative">
            <span
                className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
            >
                <svg
                    className="rotate-[270deg]"
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={baseStrokeWidth}
                >
                    <circle cx="50" cy="50" r="45"></circle>
                </svg>
            </span>
            {progress < 1.0
                ? (<>
                    <span
                        className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
                    >
                        <svg
                            className="rotate-[270deg]"
                            viewBox="0 0 100 100"
                            width="100%"
                            height="100%"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth={fillStrokeWidth}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                strokeDashoffset={Math.floor(dasharray - (progress * dasharray))}
                                strokeDasharray={dasharray}
                            ></circle>
                        </svg>
                    </span>
                    <div
                        className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
                    >
                        <p className="leading-none text-xl">
                            {Math.floor(progress * 100)}
                        </p>
                    </div>
                </>)
                : (
                    <span
                        className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
                    >
                        <svg
                            fill="none"
                            height="24"
                            width="24"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            strokeWidth={fillStrokeWidth}
                            viewBox="60 60 60 60"
                        >
                            <polyline points="65 90 85 110 115 70"></polyline>
                        </svg>
                    </span>
                )
            }
        </div>
    )
}