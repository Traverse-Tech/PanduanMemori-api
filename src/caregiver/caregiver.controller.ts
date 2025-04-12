import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Delete,
    Param,
} from '@nestjs/common'
import { CaregiverService } from './caregiver.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'
import { UpdateAssignedPatientRequestDTO } from './dto/updateAssignedPatientRequest.dto'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { SearchPatientByCredentialRequestDTO } from './dto/searchPatientByCredentialRequest.dto'
import { AddPatientToCaregiverRequestDTO } from './dto/addPatientToCaregiver.dto'

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

    @IsCaregiver()
    @Post('/add-patient')
    async addPatientToCaregiver(
        @GetCurrentUser() user: User,
        @Body() body: AddPatientToCaregiverRequestDTO
    ): Promise<void> {
        return this.caregiverService.addPatientToCaregiver(user, body)
    }

    @IsCaregiver()
    @Delete('remove-patient/:patientId')
    async removePatientFromCaregiver(
        @GetCurrentUser() user: User,
        @Param('patientId') patientId: string
    ): Promise<void> {
        return this.caregiverService.removePatientFromCaregiver(user, patientId)
    }

    @IsCaregiver()
    @Get('patients')
    async getCaregiverPatients(@GetCurrentUser() user: User) {
        const responseData = await this.caregiverService.getCaregiverPatients(
            user.id
        )

        return this.responseUtil.response({}, responseData)
    }

    @IsCaregiver()
    @Get('patients/emergency-location/logs')
    async getAllPatientEmergencyLocationLogs(
        @GetCurrentUser() caregiver: User
    ) {
        const responseData =
            await this.caregiverService.getAllPatientEmergencyLocationLogs(
                caregiver
            )

        return this.responseUtil.response({}, responseData)
    }
}
