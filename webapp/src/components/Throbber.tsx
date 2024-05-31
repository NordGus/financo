export default function Throbber() {
    const strokeWidth = 8
    const baseStrokeWidth = 2

    return (
        <span className="block h-8 w-8">
            <svg
                className="animate-spin"
                stroke="currentColor"
                fill="none"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
            >
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="opacity-50"
                    strokeWidth={baseStrokeWidth}
                ></circle>
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeDasharray={300}
                    strokeDashoffset={225}
                    strokeWidth={strokeWidth}
                ></circle>
            </svg>
        </span>
    )
}