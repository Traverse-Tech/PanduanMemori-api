import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateActivityOccurenceRequestDTO {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    activityCategoryId?: string

    @IsOptional()
    @IsDateString()
    datetime?: string
}
