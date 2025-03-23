import { IsString } from 'class-validator'

export class WeeklySummaryResponseDto {
    @IsString()
    summary: string
}
