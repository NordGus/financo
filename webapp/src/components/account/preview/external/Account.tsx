import AccountType from "../../../../types/Account"

type Props = {
    account: AccountType
}

export default function Account({ account: { name } }: Props) {
    return (
        <p className="px-4 py-1.5">{name}</p>
    )
}
