import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { RecurrenceDTO } from './createActivityRequest.dto'

export class UpdateActivityRequestDTO {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    activityCategoryId?: string

    @IsString()
    @IsOptional()
    datetime?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecurrenceDTO)
    @IsOptional()
    recurrences?: RecurrenceDTO[]
}
