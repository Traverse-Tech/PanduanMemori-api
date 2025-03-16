import { FormattedCaregiverData, FormattedPatientData } from '../auth.interface'

export class RegisterResponseDTO {
    token: string
    user: FormattedPatientData | FormattedCaregiverData
}
