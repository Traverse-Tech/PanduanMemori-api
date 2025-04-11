import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Body,
} from '@nestjs/common'
import { memoryStorage, Multer } from 'multer'
import { PatientService } from './patient.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { IsPatient } from 'src/commons/decorators/isPatient.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'
import { AddCaregiverRequestDTO } from './dto/addCaregiverRequest.dto'

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsPatient()
    @Post('buddy')
    @UseInterceptors(FileInterceptor('audio', { storage: memoryStorage() }))
    @HttpCode(HttpStatus.OK)
    async buddyConversation(
        @GetCurrentUser() user,
        @UploadedFile() audio: Multer.File
    ) {
        const responseData = await this.patientService.buddyConversation(
            user,
            audio
        )

        return this.responseUtil.response({}, responseData)
    }

    @IsPatient()
    @Get('caregivers')
    async getPatientCaregivers(@GetCurrentUser() user: User) {
        const responseData =
            await this.patientService.getPatientCaregivers(user)
        return this.responseUtil.response({}, responseData)
    }

    @IsPatient()
    @Post('add-caregiver')
    async addCaregiver(
        @GetCurrentUser() user: User,
        @Body() body: AddCaregiverRequestDTO
    ) {
        return this.patientService.addCaregiver(user, body)
    }
}
