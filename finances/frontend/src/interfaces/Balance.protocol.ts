export interface BalanceProtocol {
    valor_conta: number,
    status_recebimento: boolean,
    dt_recebimento: string
}

export interface ExpensesProtocol {
    dt_despesa: string,
    despesa: string,
    valor_despesa: number,
    status_despesa: boolean
}

export interface ExpensesCreditProtocol {
    dt_despesa_credito: string,
    despesa_credito: string,
    valor_credito: number,
    descricao: string
}