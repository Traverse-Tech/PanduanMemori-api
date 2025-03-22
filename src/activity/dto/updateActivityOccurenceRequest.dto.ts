import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateActivityOccurenceRequestDTO {
    @IsString()
    id: string

    @IsOptional()
    @IsDateString()
    datetime?: string
}
