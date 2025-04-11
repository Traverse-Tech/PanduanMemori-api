import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsDate } from 'class-validator'

export class CompleteActivityOccurrenceRequestDTO {
    @IsString()
    @IsNotEmpty()
    activityOccurenceId: string

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    actualStartTime: Date

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    endTime: Date
}
