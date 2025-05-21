export interface Category {
    id: number
    name: string
    description?: string
    isExpense: boolean
    isIncome: boolean
}
export interface CategoryPost {
    name: string
    description?: string
    type: string
}
export interface CategoryPut extends CategoryPost {
    id: number
}
export type CategoryPostAndPut = CategoryPost & Partial<CategoryPut>;