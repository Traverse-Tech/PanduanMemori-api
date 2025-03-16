import { User, Patient, Caregiver, Address } from '@prisma/client'
import { Request } from 'express'

export interface AuthenticatedRequestInterface extends Request {
    user: User
}

export interface FormattedUserData
    extends Pick<
            User,
            'name' | 'phoneNumber' | 'email' | 'registrationNumber' | 'role'
        >,
        Pick<Address, 'address'> {}

export interface FormattedPatientData
    extends FormattedUserData,
        Pick<Patient, 'birthdate' | 'gender' | 'dementiaStage'> {}

export interface FormattedCaregiverData
    extends FormattedUserData,
        Pick<Caregiver, 'patientId'> {}
