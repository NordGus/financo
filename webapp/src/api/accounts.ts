import Account from "@/types/Account"

export function getAccount(id: string): () => Promise<Account> {
    return async () => {
        const response = await fetch(`/api/accounts/${id}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export async function getCapitalNormalAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=capital_normal")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedCapitalNormalAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=capital_normal&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getCapitalSavingsAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=capital_savings")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedCapitalSavingsAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=capital_savings&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getDebtLoanAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=debt_loan,debt_personal")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedDebtLoanAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=debt_loan,debt_personal&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getDebtCreditAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=debt_credit")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedDebtCreditAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=debt_credit&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getExternalIncomeAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=external_income")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedExternalIncomeAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=external_income&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getExternalExpenseAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=external_expense")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedExternalExpenseAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts?kind=external_expense&archived=true")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}
