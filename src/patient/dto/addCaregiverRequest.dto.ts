import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddCaregiverRequestDTO {
    @IsString()
    @IsNotEmpty()
    identifier: string;
} 