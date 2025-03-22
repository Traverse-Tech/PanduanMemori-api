import { RecurrenceType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
    IsOptional,
    IsDateString,
    IsString,
    IsArray,
    ValidateNested,
    IsInt,
} from 'class-validator'

export class RecurrenceDTO {
    @IsString()
    endDate?: string

    @IsInt()
    interval: number

    @IsArray()
    @IsOptional()
    weekDays?: number[]

    @IsString()
    type: RecurrenceType
}

export class CreateActivityRequestDTO {
    @IsString()
    title: string

    @IsString()
    activityCategoryId: string

    @IsDateString()
    datetime: string // Format: ISO 8601 (contoh: "2023-10-30T08:00:00Z")

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecurrenceDTO)
    recurrences?: RecurrenceDTO[]
}
