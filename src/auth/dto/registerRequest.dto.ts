import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
} from 'class-validator'

export class RegisterRequestDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    identifier: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    role: string

    @IsString()
    @IsOptional()
    birthdate: string

    @IsString()
    @IsOptional()
    gender: string

    @ValidateIf((o) => o.role === 'CAREGIVER')
    @IsString()
    @IsNotEmpty()
    address: string

    @ValidateIf((o) => o.role === 'CAREGIVER')
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number

    @ValidateIf((o) => o.role === 'CAREGIVER')
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number
}
