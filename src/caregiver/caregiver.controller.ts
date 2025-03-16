import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
} from '@nestjs/common'
import { CaregiverService } from './caregiver.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { LoginRequestDTO } from 'src/auth/dto/loginRequest.dto'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'
import { UpdateAssignedPatientRequestDTO } from './dto/updateAssignedPatientRequest.dto'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'

@Controller('caregiver')
export class CaregiverController {
    constructor(
        private readonly caregiverService: CaregiverService,
        private readonly responseUtil: ResponseUtil
    ) {}

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
    async searchPatientByCredential(@Body() body: LoginRequestDTO) {
        const responseData =
            await this.caregiverService.searchPatientByCredential(body)

        return this.responseUtil.response({}, responseData)
    }
}
