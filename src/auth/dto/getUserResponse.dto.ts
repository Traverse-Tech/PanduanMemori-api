import { FormattedCaregiverData, FormattedPatientData } from "../auth.interface"

export class GetUserResponseDTO {
    user: FormattedPatientData | FormattedCaregiverData
    isAssignedToPatient?: boolean
}
