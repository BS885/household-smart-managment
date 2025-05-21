export interface User {
    id: number
    name: string
    email: string
    role: "Admin" | "User"
    address: string
    city: string
    phone: string
    createIn: string
}
export interface UserWithPassword extends Omit<User, "id" | "createIn"> {
    password: string;
  }