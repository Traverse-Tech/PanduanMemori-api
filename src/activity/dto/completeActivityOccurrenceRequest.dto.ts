import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CompleteActivityOccurrenceRequestDTO {
    @IsString()
    @IsNotEmpty()
    activityOccurenceId: string;

    @IsDate()
    @IsNotEmpty()
    actualStartTime: Date;

    @IsDate()
    @IsNotEmpty()
    endTime: Date;
} 