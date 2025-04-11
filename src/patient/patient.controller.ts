import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { memoryStorage, Multer } from 'multer'
import { PatientService } from './patient.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { IsPatient } from 'src/commons/decorators/isPatient.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { GetCurrentUser } from 'src/commons/decorators/getCurrentUser.decorator'

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
}
