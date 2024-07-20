import { Account } from "@/types/Transaction";

export default function accountNameText(account: Account): string {
    if (!!account.parent) return `${account.parent.name} (${account.name})`;

    return account.name
}
