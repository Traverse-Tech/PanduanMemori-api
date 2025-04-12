import { IsNumber, IsNotEmpty, Max, Min } from 'class-validator'

export class UpdateLocationDTO {
    @IsNumber()
    @Min(-90)
    @Max(90)
    @IsNotEmpty()
    latitude: number

    @IsNumber()
    @Min(-180)
    @Max(180)
    @IsNotEmpty()
    longitude: number
}
