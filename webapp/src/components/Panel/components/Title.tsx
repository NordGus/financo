interface TitleProps {
    text: string
    grow?: boolean
}

export function Title({ text, grow = false }: TitleProps) {
    return <p className={`flex items-center px-2 ${grow ? "flex-grow" : ""}`}>
        {text}
    </p>
}