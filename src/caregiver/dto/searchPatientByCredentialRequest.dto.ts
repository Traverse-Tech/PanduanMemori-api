import { IsNotEmpty, IsString } from 'class-validator'

export class SearchPatientByCredentialRequestDTO {
    @IsString()
    @IsNotEmpty()
    identifier: string

    @IsString()
    @IsNotEmpty()
    password: string
}
