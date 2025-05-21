export interface Permission {
    id: number
    name: string
    description: string
    roleNames: { roleName: string }[]
}