import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
} from '@nestjs/common'
import { CaregiverService } from './caregiver.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'
import { UpdateAssignedPatientRequestDTO } from './dto/updateAssignedPatientRequest.dto'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { SearchPatientByCredentialRequestDTO } from './dto/searchPatientByCredentialRequest.dto'

@Controller('caregiver')
export class CaregiverController {
    constructor(
        private readonly caregiverService: CaregiverService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsCaregiver()
    @Get('peers')
    @HttpCode(HttpStatus.OK)
    async getPeerCaregivers(@GetCurrentUser() user: User) {
        const responseData = await this.caregiverService.getPeerCaregivers(user)

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Patch('updateAssignedPatient')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateAssignedPatient(
        @GetCurrentUser() user: User,
        @Body() body: UpdateAssignedPatientRequestDTO
    ) {
        await this.caregiverService.updateAssignedPatient(user, body)
    }

    @IsCaregiver()
    @Post('patients/search-by-credential')
    @HttpCode(HttpStatus.OK)
    async searchPatientByCredential(
        @Body() body: SearchPatientByCredentialRequestDTO
    ) {
        const responseData =
            await this.caregiverService.searchPatientByCredential(body)

        return this.responseUtil.response({}, responseData)
    }
}
