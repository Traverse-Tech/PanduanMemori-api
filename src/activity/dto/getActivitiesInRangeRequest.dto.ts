import { IsDateString, IsNotEmpty, ValidateIf } from 'class-validator'
import { INVALID_DATE_RANGE_ERROR_DESCRIPTION } from '../activity.constant'

export class GetActivitiesInRangeRequestDTO {
    @IsNotEmpty()
    @IsDateString()
    startDate: string

    @IsNotEmpty()
    @IsDateString()
    @ValidateIf(
        (o) => {
            const start = new Date(o.startDate)
            const end = new Date(o.endDate)
            return end >= start
        },
        { message: INVALID_DATE_RANGE_ERROR_DESCRIPTION }
    )
    endDate: string
}
