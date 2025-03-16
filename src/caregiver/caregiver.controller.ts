import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CaregiverService } from './caregiver.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { LoginRequestDTO } from 'src/auth/dto/loginRequest.dto'
import { IsCaregiver } from 'src/commons/decorators/isCaregiver.decorator'

@Controller('caregiver')
export class CaregiverController {
    constructor(
        private readonly caregiverService: CaregiverService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsCaregiver()
    @Post('patients/search-by-credential')
    @HttpCode(HttpStatus.OK)
    async searchPatientByCredential(@Body() body: LoginRequestDTO) {
        const responseData =
            await this.caregiverService.searchPatientByCredential(body)

        return this.responseUtil.response({}, responseData)
    }
}
