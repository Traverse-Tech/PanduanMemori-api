import { User, DementiaStage, Gender, UserRole, PatientCaregiver, Address } from '@prisma/client'
import { Request } from 'express'

export interface AuthenticatedRequestInterface extends Request {
    user: User
    token: string
}

export interface FormattedUserData {
    name: string
    phoneNumber: string
    email: string
    registrationNumber: string
    role: UserRole
}

export interface FormattedPatientData extends FormattedUserData {
    birthdate: Date
    gender: Gender
    dementiaStage: DementiaStage
    caregivers: PatientCaregiver[]
}

export interface FormattedCaregiverData extends FormattedUserData {
    safeLocation: Address
    patients: PatientCaregiver[]
}
