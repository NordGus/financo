import { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Currency } from "dinero.js";

import { staleTimeDefault } from "@queries/Client";
import { getCurrencies } from "@api/currencies";

import { Button } from "@components/ui/button";

interface NewProps {
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function NewAccountForm({ setOpen }: NewProps) {
    const [currency, setCurrency] = useState<Currency>("EUR")

    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    return (
        <div className="py-4">
            <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
    )
}