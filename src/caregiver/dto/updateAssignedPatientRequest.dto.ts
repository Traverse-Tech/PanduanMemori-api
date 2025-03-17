import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateAssignedPatientRequestDTO {
    @IsNotEmpty()
    @IsString()
    patientId: string
}
