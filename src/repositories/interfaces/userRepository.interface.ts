import { UserRole } from '@prisma/client'

export interface CreateUserInterface {
    name: string
    phoneNumber: string
    email: string
    password: string
    registrationNumber: string
    role: UserRole
}
