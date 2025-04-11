import { IsString } from 'class-validator'

export class DeleteActivityRequestDTO {
    @IsString()
    activityId: string

    @IsString()
    patientId: string
}
