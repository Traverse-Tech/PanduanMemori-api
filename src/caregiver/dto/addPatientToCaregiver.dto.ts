import { IsNotEmpty, IsString } from 'class-validator'

export class AddPatientToCaregiverRequestDTO {
    @IsString()
    @IsNotEmpty()
    identifier: string
}
