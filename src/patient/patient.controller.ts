import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { memoryStorage, Multer } from "multer";
import { PatientService } from "./patient.service";
import { ResponseUtil } from "src/commons/utils/response.util";
import { IsPatient } from "src/commons/decorators/isPatient.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "@prisma/client";
import { GetCurrentUser } from "src/commons/decorators/getCurrentUser.decorator";
import { AddCaregiverRequestDTO } from "./dto/addCaregiverRequest.dto";

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
    async buddyConversation(@UploadedFile() audio: Multer.File) {
        if (!audio)
            throw new BadRequestException("Tidak ada suara permintaan")

        const responseData = await this.patientService.buddyConversation(audio)

        return this.responseUtil.response({}, responseData)
    }

    @IsPatient()
    @Get('caregivers')
    async getCaregivers(@GetCurrentUser() user: User) {
        return this.patientService.getCaregivers(user)
    }

    @IsPatient()
    @Post('add-caregiver')
    async addCaregiver(@GetCurrentUser() user: User, @Body() body: AddCaregiverRequestDTO) {
        return this.patientService.addCaregiver(user, body)
    }
}