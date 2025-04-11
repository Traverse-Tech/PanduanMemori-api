import { Gender } from '@prisma/client'

export interface CreatePatientInterface {
    userId: string
    birthdate: Date
    gender: Gender
}
