import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Get,
    Param,
} from '@nestjs/common'
import { IsPublic } from 'src/commons/decorators/isPublic.decorator'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'
import { LocationService } from './location.service'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { UpsertUserLocationDto } from './dto/upsertUserLocation.dto'
import { ResponseUtil } from 'src/commons/utils/response.util'

@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsPublic()
    @Post()
    @HttpCode(HttpStatus.OK)
    async upsertLocation(
        @GetCurrentUser() user: User,
        @Body() body: UpsertUserLocationDto
    ) {
        const location = await this.locationService.upsertLocation(user, body)
        return this.responseUtil.response({}, location)
    }

    @IsCaregiver()
    @Get('check-patient/:patientId')
    async isPatientInSafeLocation(@Param('patientId') patientId: string) {
        const responseData =
            await this.locationService.isPatientInSafeLocation(patientId)
        return this.responseUtil.response({}, responseData)
    }
}
