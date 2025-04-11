import { RecurrenceType } from '@prisma/client'
import {
    IsOptional,
    IsDateString,
    IsString,
    IsArray,
    IsNotEmpty,
    ValidateIf,
    IsEnum,
    IsNumber,
    ArrayMinSize,
    ArrayMaxSize,
    Max,
} from 'class-validator'
import { INVALID_DAILY_INTERVAL_ERROR_MESSAGE } from '../activity.constant'

export class RecurrenceDTO {
    @IsEnum(RecurrenceType)
    type: RecurrenceType

    @IsOptional()
    @IsNumber()
    @ValidateIf((o) => o.type === RecurrenceType.DAILY)
    @Max(1, { message: INVALID_DAILY_INTERVAL_ERROR_MESSAGE })
    interval?: number

    @IsOptional()
    @ValidateIf((o) => o.endDate !== null)
    @IsDateString()
    endDate?: string

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(7)
    weekDays?: number[]
}

export class CreateActivityRequestDTO {
    @IsString()
    @IsNotEmpty()
    patientId: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    activityCategoryId: string

    @IsDateString()
    @IsNotEmpty()
    datetime: string // Format: ISO 8601 (contoh: "2023-10-30T08:00:00Z")

    @IsOptional()
    @IsArray()
    @ValidateIf((o) => o.recurrences !== undefined)
    recurrences?: RecurrenceDTO[]
}
