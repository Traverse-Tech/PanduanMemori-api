import { IsNotEmpty, IsString } from 'class-validator'

export class LoginRequestDTO {
    @IsString()
    @IsNotEmpty()
    identifier: string

    @IsString()
    @IsNotEmpty()
    password: string
}
