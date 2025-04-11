import { LocationSource } from '@prisma/client'
import { IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator'

export class UpsertUserLocationDto {
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude: number

    @IsNumber()
    @IsOptional()
    accuracy?: number

    @IsEnum(LocationSource)
    @IsOptional()
    source?: LocationSource
}
