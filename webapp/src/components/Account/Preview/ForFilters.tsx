import { useMemo } from "react";
import Color from "colorjs.io";

import { Preview } from "@/types/Account";

import isExternalAccount from "@helpers/account/isExternalAccount";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";

interface ForFiltersProps {
    account: Preview,
    active: boolean,
    onClick: React.MouseEventHandler<HTMLSpanElement>
}

export default function ForFilters({
    account: {
        name,
        kind,
        currency,
        balance,
        color,
    },
    active,
    onClick
}: ForFiltersProps) {
    const clr = useMemo(() => { return new Color(color) }, [color])
    const activeClr = clr.to("HSL").set({ l: (l) => l >= 50 ? 1 : 100 }) // WTF
    const toStringConfig = { precision: 3, format: "rgb" }

    return (
        <div
            className="px-2 py-1.5 inline rounded min-w-[8rem] border-2 cursor-pointer"
            style={{
                backgroundColor: active ? clr.toString(toStringConfig) : 'transparent',
                borderColor: clr.toString(toStringConfig),
                color: active
                    ? activeClr.toString(toStringConfig)
                    : clr.toString(toStringConfig)
            }}
            onClick={onClick}
        >
            <p className="font-bold">{name}</p>
            <p className={`${isExternalAccount(kind) ? "text-transparent" : ""} text-sm`}>
                {currencyAmountToHuman(balance, currency)}
            </p>
        </div >
    )
}