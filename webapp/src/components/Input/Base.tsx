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
        className="px-2 py-1.5 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-800 rounded shadow"
    />
}