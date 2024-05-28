import Account from "../../../../types/Account"

type Props = {
    account: Account
}

export default function Normal({ account: { name } }: Props) {
    return (
        <p className="px-4 py-1.5">{name}</p>
    )
}
