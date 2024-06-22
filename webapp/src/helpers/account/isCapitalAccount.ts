import { Kind } from "@/types/Account";

export default function isCapitalAccount(kind: Kind): boolean {
    return [Kind.CapitalNormal, Kind.CapitalSavings].includes(kind)
}