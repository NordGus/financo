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
    const response = await fetch("/api/accounts/capital/normal")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedCapitalNormalAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/capital/normal/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getCapitalSavingsAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/capital/savings")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedCapitalSavingsAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/capital/savings/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getDebtLoanAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/debt/loans")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedDebtLoanAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/debt/loans/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getDebtCreditAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/debt/credit")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedDebtCreditAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/debt/credit/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getExternalIncomeAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/external/income")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedExternalIncomeAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/external/income/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getExternalExpenseAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/external/expenses")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedExternalExpenseAccounts(): Promise<Account[]> {
    const response = await fetch("/api/accounts/external/expenses/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}
