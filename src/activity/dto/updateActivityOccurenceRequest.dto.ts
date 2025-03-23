import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateActivityOccurenceRequestDTO {
    @IsString()
    id: string

    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    activityCategoryId?: string

    @IsOptional()
    @IsDateString()
    datetime?: string
}
