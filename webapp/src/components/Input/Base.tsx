interface InputProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
> {
    type: string,
    id: string,
    name: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function Base({ type, id, name, value, onChange }: InputProps) {
    return <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="px-2 py-1.5 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded shadow"
    />
}