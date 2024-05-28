import Account from "../types/Account"

import CapitalNormal from "./account/preview/capital/Normal";
import CapitalSavings from "./account/preview/capital/Savings";

type Props = {
    account: Account
}

export default function AccountPreview({ account }: Props) {
    switch (account.kind) {
        case "capital.normal":
            return <CapitalNormal account={account} />
        case "capital.savings":
            return <CapitalSavings account={account} />
        case "debt.loan":
            return <CapitalSavings account={account} />
        default:
            break;
    }
}